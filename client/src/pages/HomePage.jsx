import React, { useEffect, useMemo, useState } from 'react'
import { signOut } from '../firebase/firebase'
import { useAuth } from '../firebase/AuthContext'
import { db } from '../firebase/firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, query, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

function getInitialsFromName(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ''
  const second = parts[1]?.[0] || ''
  return (first + second).toUpperCase()
}

function Avatar({ displayName, size = 40 }) {
  const initials = useMemo(() => getInitialsFromName(displayName), [displayName])
  const bg = '#0A66C2'
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700
    }}>
      {initials}
    </div>
  )
}

function PostCard({ post, onToggleLike, onAddComment, currentUserId }) {
  const [comment, setComment] = useState('')
  const isLiked = (post.likes || []).includes(currentUserId)
  const likeCount = (post.likes || []).length
  const comments = post.comments || []
  
  return (
    <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <Avatar displayName={post.authorName} />
        <div>
          <div style={{ fontWeight: 700 }}>{post.authorName}</div>
          <div style={{ color: '#666', fontSize: 12 }}>{post.createdAt?.toDate?.().toLocaleString?.() || 'Just now'}</div>
        </div>
      </div>
      <div style={{ margin: '8px 0 12px' }}>{post.text}</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button onClick={onToggleLike} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: isLiked ? '#E8F3FF' : 'white', color: isLiked ? '#0A66C2' : '#111', fontWeight: 600 }}>
          {isLiked ? 'Unlike' : 'Like'} • {likeCount}
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: '8px 10px' }} />
          <button disabled={!comment.trim()} onClick={() => { onAddComment(comment.trim()); setComment('') }} style={{ padding: '8px 12px', background: '#0A66C2', color: 'white', border: 0, borderRadius: 6, fontWeight: 600, opacity: comment.trim() ? 1 : 0.6 }}>Comment</button>
        </div>
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {comments.map((c, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8 }}>
              <Avatar displayName={c.authorName} size={28} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.authorName}</div>
                <div style={{ fontSize: 14 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [demoPostsAdded, setDemoPostsAdded] = useState(false)
  
  // Default demo posts for immediate display
  const defaultDemoPosts = useMemo(() => [
    {
      id: 'demo-1',
      text: 'Welcome to the demo feed! Share your first update.',
      authorId: 'demo',
      authorName: 'LinkedIn Demo',
      likes: [],
      comments: [],
      createdAt: { toDate: () => new Date() }
    },
    {
      id: 'demo-2',
      text: 'Hiring: We are looking for a frontend engineer. DM if interested!',
      authorId: 'demo',
      authorName: 'LinkedIn Demo',
      likes: [],
      comments: [],
      createdAt: { toDate: () => new Date() }
    },
    {
      id: 'demo-3',
      text: 'Tip: Use Firestore for a realtime, universal feed across users.',
      authorId: 'demo',
      authorName: 'LinkedIn Demo',
      likes: [],
      comments: [],
      createdAt: { toDate: () => new Date() }
    }
  ], [])
  
  useEffect(() => {
    // Only proceed if user is authenticated
    if (!user) {
      setLoading(false)
      return
    }

    // Set default posts immediately for fast loading
    setPosts(defaultDemoPosts)
    setLoading(false)

    // Set up timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Connection timeout. Using demo data.')
        setLoading(false)
        setPosts(defaultDemoPosts)
      }
    }, 5000) // 5 second timeout

    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const unsub = onSnapshot(q, 
        (snap) => {
          clearTimeout(timeoutId)
          const list = []
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }))
          setPosts(list)
          setLoading(false)
          setError(null)
          
          // Ensure demo posts exist
          if (!demoPostsAdded) {
            ensureDemoPosts(list)
            setDemoPostsAdded(true)
          }
        },
        (error) => {
          clearTimeout(timeoutId)
          console.error('Firestore error:', error)
          setError('Failed to load posts. Using demo data.')
          setLoading(false)
          setPosts(defaultDemoPosts)
        }
      )
      return () => {
        clearTimeout(timeoutId)
        unsub()
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Setup error:', error)
      setError('Failed to connect to database. Using demo data.')
      setLoading(false)
      setPosts(defaultDemoPosts)
    }
  }, [user, demoPostsAdded, defaultDemoPosts, loading])

  async function toggleLike(postId, isLiked) {
    try {
      const ref = doc(db, 'posts', postId)
      await updateDoc(ref, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      })
    } catch (error) {
      console.error('Error updating like:', error)
      // Optimistic update for demo posts
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: isLiked 
              ? post.likes.filter(id => id !== user.uid)
              : [...(post.likes || []), user.uid] 
            }
          : post
      ))
    }
  }

  async function addComment(postId, text) {
    try {
      const ref = doc(db, 'posts', postId)
      await updateDoc(ref, {
        comments: arrayUnion({ text, authorId: user.uid, authorName: user.displayName || 'Anonymous', createdAt: Date.now() })
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      // Optimistic update for demo posts
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), { text, authorId: user.uid, authorName: user.displayName || 'Anonymous', createdAt: Date.now() }] }
          : post
      ))
    }
  }

  async function ensureDemoPosts(existingPosts) {
    const demoPostTexts = [
      'Welcome to the demo feed! Share your first update.',
      'Hiring: We are looking for a frontend engineer. DM if interested!',
      'Tip: Use Firestore for a realtime, universal feed across users.',
    ]
    
    try {
      const existingDemoPosts = existingPosts.filter(post => post.authorId === 'demo')
      
      if (existingDemoPosts.length < 3) {
        const existingTexts = existingDemoPosts.map(post => post.text)
        const missingTexts = demoPostTexts.filter(text => !existingTexts.includes(text))
        
        for (const text of missingTexts) {
          await addDoc(collection(db, 'posts'), {
            text,
            authorId: 'demo',
            authorName: 'LinkedIn Demo',
            likes: [],
            comments: [],
            createdAt: serverTimestamp(),
          })
        }
      }
    } catch (error) {
      console.error('Error creating demo posts:', error)
    }
  }

  // Show demo posts (with fallback to default posts)
  const sortedPosts = useMemo(() => {
    const demoPosts = posts.filter(post => post.authorId === 'demo')
    return demoPosts.length > 0 ? demoPosts : defaultDemoPosts
  }, [posts, defaultDemoPosts])

  if (!user) {
    return <div style={{ padding: 20 }}>Please log in to continue.</div>
  }

  return (
    <div style={{ background: '#F3F2EF', minHeight: '100vh' }}>
      <header style={{ position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid #e5e5e5', padding: '10px 16px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontWeight: 800, color: '#0A66C2', fontSize: 20 }}>Demo-LinkedIn</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar displayName={user.displayName} />
          <div style={{ fontSize: 12 }}>{user.displayName}</div>
          <button onClick={signOut} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', background: 'white' }}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: '16px auto' }}>
        {error && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 8, padding: 12, marginBottom: 16, color: '#856404' }}>
            {error}
          </div>
        )}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            Loading posts...
          </div>
        ) : (
          <section style={{ display: 'grid', gap: 16 }}>
            {sortedPosts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                currentUserId={user.uid}
                onToggleLike={() => toggleLike(p.id, (p.likes || []).includes(user.uid))}
                onAddComment={(text) => addComment(p.id, text)}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}