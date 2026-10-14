import { useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function App() {
  const [page, setPage] = useState('home')
  const [profile, setProfile] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminPosts, setAdminPosts] = useState([])
  const [skills, setSkills] = useState([])
  const [skillsError, setSkillsError] = useState('')
  const [newSkill, setNewSkill] = useState('')

  const [projects, setProjects] = useState([])
  const [projectsError, setProjectsError] = useState('')

  const [posts, setPosts] = useState([])
  const [postsError, setPostsError] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [editedPostContent, setEditedPostContent] = useState('')

  const [postLikeCounts, setPostLikeCounts] = useState({})
  const [postComments, setPostComments] = useState({})
  const [newCommentContent, setNewCommentContent] = useState({})

  const [connections, setConnections] = useState([])
  const [connectionRequests, setConnectionRequests] = useState([])
  const [connectionsError, setConnectionsError] = useState('')

  const [notifications, setNotifications] = useState([])
  const [notificationsError, setNotificationsError] = useState('')

  const [studentSearch, setStudentSearch] = useState('')
  const [searchType, setSearchType] = useState('name')
  const [searchResults, setSearchResults] = useState([])


  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    projectUrl: '',
  })
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    technologies: '',
    projectUrl: '',
  })


  const [editingSkillId, setEditingSkillId] = useState(null)
  const [editedSkillName, setEditedSkillName] = useState('')
  const [profileError, setProfileError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    bio: '',
    education: '',
    location: '',
    phone: '',
  })

async function loadProfile() {
  const token = localStorage.getItem('token')

  if (!token) {
    setProfileError('Please log in first.')
    setProfile(null)
    return
  }

  setProfileError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not load profile (${response.status})`)
    }

    const data = await response.json()
    setProfile(data)
    setCurrentUserId(data.id)
  } catch (error) {
    console.error('Profile error:', error)
    setProfileError(error.message)
  }
}


async function loadAdminData() {
  const token = localStorage.getItem('token')

  if (!token || localStorage.getItem('isAdmin') !== 'true') {
    alert('Admin access required.')
    return
  }

  try {
    const [usersResponse, postsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${API_BASE_URL}/api/admin/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ])

    if (!usersResponse.ok || !postsResponse.ok) {
      throw new Error('Could not load admin data. Check backend authorization.')
    }

    const users = await usersResponse.json()
    const posts = await postsResponse.json()

    setAdminUsers(users)
    setAdminPosts(posts)
  } catch (error) {
    console.error('Admin dashboard error:', error)
    alert(error.message)
  }
}




async function loadSkills() {
  const token = localStorage.getItem('token')

  if (!token) {
    setSkillsError('Please log in first.')
    setSkills([])
    return
  }

  if (!currentUserId) {
    await loadProfile()
    return
  }

  setSkillsError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/skills/user/${currentUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not load skills. Status: ${response.status}`)
    }

    const data = await response.json()
    setSkills(data)
  } catch (error) {
    console.error('Skills error:', error)
    setSkillsError(error.message)
  }
}


async function loadProjects() {
  const token = localStorage.getItem('token')

  if (!token) {
    setProjectsError('Please log in first.')
    setProjects([])
    return
  }

  if (!currentUserId) {
    setProjects([])
    setProjectsError('')
    return
  }

  setProjectsError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/user/${currentUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Could not load projects. Status: ${response.status}`
      )
    }

    const data = await response.json()
    setProjects(data)
  } catch (error) {
    console.error('Projects error:', error)
    setProjectsError(error.message)
  }
}



async function loadConnections() {
  const token = localStorage.getItem('token')

  if (!token) {
    setConnectionsError('Please log in first.')
    setConnections([])
    setConnectionRequests([])
    return
  }

  if (!currentUserId) {
    return
  }

  setConnectionsError('')

  try {
    const [connectionsResponse, requestsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/connections/user/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${API_BASE_URL}/api/connections/requests/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ])

    if (!connectionsResponse.ok || !requestsResponse.ok) {
      throw new Error('Could not load connections. Please try again.')
    }

    const connectionsData = await connectionsResponse.json()
    const requestsData = await requestsResponse.json()

    setConnections(connectionsData)
    setConnectionRequests(requestsData)
  } catch (error) {
    console.error('Load connections error:', error)
    setConnectionsError(error.message)
  }
}


async function loadNotifications() {
  const token = localStorage.getItem('token')

  if (!token) {
    setNotificationsError('Please log in first.')
    setNotifications([])
    return
  }

  if (!currentUserId) {
    await loadProfile()
    return
  }

  setNotificationsError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/user/${currentUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not load notifications: ${response.status}`)
    }

    const data = await response.json()
    setNotifications(data)
  } catch (error) {
    console.error('Load notifications error:', error)
    setNotificationsError(error.message)
  }
}

async function handleMarkAsRead(notificationId) {
  const token = localStorage.getItem('token')

  if (!token) {
    setNotificationsError('Please log in first.')
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Could not mark notification as read: ${response.status}`
      )
    }

    await loadNotifications()
  } catch (error) {
    console.error('Mark notification as read error:', error)
    setNotificationsError(error.message)
  }
}





async function searchStudents() {
  const token = localStorage.getItem('token')

  if (!token) {
    setConnectionsError('Please log in first.')
    return
  }

  if (!studentSearch.trim()) {
    setConnectionsError('Please enter a name or skill to search.')
    setSearchResults([])
    return
  }

  try {
    setConnectionsError('')

    const endpoint =
      searchType === 'skill'
        ? `${API_BASE_URL}/api/users/search/skill?skill=${encodeURIComponent(studentSearch.trim())}`
        : `${API_BASE_URL}/api/users/search?name=${encodeURIComponent(studentSearch.trim())}`

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Student search failed: ${response.status}`)
    }

    const data = await response.json()

    setSearchResults(
      data.filter((student) => student.id !== 1)
    )
  } catch (error) {
    console.error('Student search error:', error)
    setConnectionsError(error.message)
    setSearchResults([])
  }
}


async function handleSendConnectionRequest(receiverId) {
  const token = localStorage.getItem('token')

  if (!token) {
    setConnectionsError('Please log in first.')
    return
  }

  try {
    setConnectionsError('')

    const response = await fetch(
      `${API_BASE_URL}/api/connections/send/1/${receiverId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        'Could not send request. The request may already exist.'
      )
    }

    alert('Connection request sent successfully!')
    await loadConnections()
  } catch (error) {
    setConnectionsError(error.message)
  }
}






async function loadPosts() {
  const token = localStorage.getItem('token')

  if (!token) {
    setPostsError('Please log in first.')
    setPosts([])
    return
  }

  setPostsError('')

  try {
    let userId = currentUserId

    if (!userId) {
      const profileResponse = await fetch(
        `${API_BASE_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!profileResponse.ok) {
        throw new Error(
          `Could not load profile: ${profileResponse.status}`
        )
      }

      const profileData = await profileResponse.json()
      setProfile(profileData)
      setCurrentUserId(profileData.id)
      userId = profileData.id
    }

    const response = await fetch(
      `${API_BASE_URL}/api/posts/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not load posts: ${response.status}`)
    }

    const data = await response.json()
    setPosts(data)
    await loadPostInteractions(data)
  } catch (error) {
    console.error('Load posts error:', error)
    setPostsError(error.message)
  }
}


async function loadPostInteractions(postList) {
  const token = localStorage.getItem('token')

  if (!token) {
    return
  }

  try {
    const likeCounts = {}
    const commentsByPost = {}

    await Promise.all(
      postList.map(async (post) => {
        const [likesResponse, commentsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/posts/${post.id}/likes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/comments/post/${post.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        if (!likesResponse.ok || !commentsResponse.ok) {
          throw new Error(`Could not load interactions for post ${post.id}`)
        }

        likeCounts[post.id] = await likesResponse.json()
        commentsByPost[post.id] = await commentsResponse.json()
      })
    )

    setPostLikeCounts(likeCounts)
    setPostComments(commentsByPost)
  } catch (error) {
    console.error('Load likes and comments error:', error)
    setPostsError(error.message)
  }
}



async function handleAddProject(e) {
  e.preventDefault()

  const token = localStorage.getItem('token')

  if (!token) {
    setProjectsError('Please log in first.')
    return
  }

  if (!newProject.title.trim()) {
    setProjectsError('Please enter a project title.')
    return
  }
  if (!currentUserId) {
    await loadProfile()
    setProjectsError('Profile is loading. Please click Add Project again.')
    return
  }

  setProjectsError('')

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/user/${currentUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newProject.title.trim(),
          description: newProject.description.trim(),
          technologies: newProject.technologies.trim(),
          projectUrl: newProject.projectUrl.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend response:', errorText)

      throw new Error(
        `Could not add project. Status: ${response.status} - ${errorText}`
      )
    }

    setNewProject({
      title: '',
      description: '',
      technologies: '',
      projectUrl: '',
    })

    await loadProjects()
  } catch (error) {
    console.error('Add project error:', error)
    setProjectsError(error.message)
  }
}

async function handleAddPost(event) {
  event.preventDefault()

  const token = localStorage.getItem('token')

  if (!token) {
    setPostsError('Please log in first.')
    return
  }

  if (!newPostContent.trim()) {
    setPostsError('Please enter some post content.')
    return
  }

  try {
    setPostsError('')

    const response = await fetch(
      `${API_BASE_URL}/api/posts/user/1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newPostContent.trim(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Could not create post: ${response.status}`)
    }

    setNewPostContent('')
    await loadPosts()
  } catch (error) {
    console.error('Create post error:', error)
    setPostsError(error.message)
  }
}

async function handleUpdatePost(postId) {
  const token = localStorage.getItem('token')

  if (!token) {
    setPostsError('Please log in first.')
    return
  }

  if (!editedPostContent.trim()) {
    setPostsError('Post content cannot be empty.')
    return
  }

  try {
    setPostsError('')

    const response = await fetch(
      `${API_BASE_URL}/api/posts/${postId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editedPostContent.trim(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Could not update post: ${response.status}`)
    }

    setEditingPostId(null)
    setEditedPostContent('')
    await loadPosts()
  } catch (error) {
    console.error('Update post error:', error)
    setPostsError(error.message)
  }
}

async function handleDeletePost(postId) {
  const token = localStorage.getItem('token')

  if (!token) {
    setPostsError('Please log in first.')
    return
  }

  if (!window.confirm('Are you sure you want to delete this post?')) {
    return
  }

  try {
    setPostsError('')

    const response = await fetch(
      `${API_BASE_URL}/api/posts/${postId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not delete post: ${response.status}`)
    }

    await loadPosts()
  } catch (error) {
    console.error('Delete post error:', error)
    setPostsError(error.message)
  }
}

async function handleLikePost(postId) {
  const token = localStorage.getItem('token')

  if (!token) {
    setPostsError('Please log in first.')
    return
  }

  try {
    setPostsError('')

    const response = await fetch(
      `${API_BASE_URL}/api/posts/${postId}/like/1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not like post: ${response.status}`)
    }

    await loadPostInteractions(posts)
  } catch (error) {
    console.error('Like post error:', error)
    setPostsError(error.message)
  }
}

async function handleAddComment(event, postId) {
  event.preventDefault()

  const token = localStorage.getItem('token')
  const content = (newCommentContent[postId] || '').trim()

  if (!token) {
    setPostsError('Please log in first.')
    return
  }

  if (!content) {
    setPostsError('Please enter a comment.')
    return
  }

  try {
    setPostsError('')

    const response = await fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        user: { id: 1 },
        post: { id: postId },
      }),
    })

    if (!response.ok) {
      throw new Error(`Could not add comment: ${response.status}`)
    }

    setNewCommentContent((previous) => ({
      ...previous,
      [postId]: '',
    }))

    await loadPostInteractions(posts)
  } catch (error) {
    console.error('Add comment error:', error)
    setPostsError(error.message)
  }
}

async function handleDeleteComment(commentId) {
  const token = localStorage.getItem('token')

  if (!token) {
    setPostsError('Please log in first.')
    return
  }

  if (!window.confirm('Are you sure you want to delete this comment?')) {
    return
  }

  try {
    setPostsError('')

    const response = await fetch(
      `${API_BASE_URL}/api/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Could not delete comment: ${response.status}`)
    }

    await loadPostInteractions(posts)
  } catch (error) {
    console.error('Delete comment error:', error)
    setPostsError(error.message)
  }
}










function startEditing() {
  setEditData({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    education: profile.education || '',
    location: profile.location || '',
    phone: profile.phone || '',
  })

  setIsEditing(true)
}

async function handleProfileUpdate(event) {
  event.preventDefault()

  const token = localStorage.getItem('token')

  try {
    if (!currentUserId) {
      setProfileError('User profile is still loading. Please try again.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/users/${currentUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),

      }
    )

    if (!response.ok) {
      throw new Error(`Profile update failed (${response.status})`)
    }

    setProfile({ ...profile, ...editData })
    setIsEditing(false)
    setProfileError('')
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Profile update error:', error)
    setProfileError(error.message)
  }
}


  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  })



async function handleLogin(event) {
  event.preventDefault()

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })


    const result = await response.json()
    const token = result.message

    if (
      !response.ok ||
      !token ||
      token === 'Invalid email or password'
    ) {
      throw new Error(token || 'Login failed')
    }

    localStorage.setItem('token', token)
    alert('Login successful! Token saved.')
  } catch (error) {
    console.error('Login error:', error)
    alert('Login failed: ' + error.message)
  }
}


async function handleAdminLogin(event) {
  event.preventDefault()

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    const token = await response.text()

    if (!response.ok || !token || token.includes('error')) {
      throw new Error(token || 'Admin login failed')
    }

    localStorage.setItem('token', token)
    localStorage.removeItem('isAdmin')
    setIsAdmin(false)
    localStorage.setItem('isAdmin', 'true')
    setIsAdmin(true)
    alert('Admin login successful!')
  } catch (error) {
    console.error('Admin login error:', error)
    alert('Admin login failed: ' + error.message)
  }
}



async function handleRegister(event) {
  event.preventDefault()

  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Registration failed')
    }

    alert('Registration successful! You can now log in.')

    setRegisterData({
      name: '',
      email: '',
      password: '',
    })

    setPage('login')
  } catch (error) {
    console.error('Registration error:', error)
    alert(
      'Registration failed. Please check the backend and try again. ' +
      error.message
    )
  }
}

  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="logo" onClick={() => setPage('home')}>
          SkillConnect
        </h2>

        <div className="nav-links">
          <a href="#home" onClick={() => setPage('home')}>Home</a>

          {isAdmin && (
            <a
              href="#admin"
              onClick={async (e) => {
                e.preventDefault()
                setPage('admin')
                await loadAdminData()
              }}
            >
              Admin Dashboard
            </a>
          )}

          <a href="#skills" onClick={(e) => {
            e.preventDefault()
            setPage('skills')
            loadSkills()
          }}>Skills</a>

          <a href="#projects" onClick={(e) => {
            e.preventDefault()
            setPage('projects')
            loadProjects()
          }}>Projects</a>


          <a
            href="#connections"
            onClick={async (e) => {
              e.preventDefault()
              setPage('connections')

              if (!currentUserId) {
                await loadProfile()
              } else {
                await loadConnections()
              }
            }}
          >
            Connections
          </a>


          <a
            href="#feed"
            onClick={(e) => {
              e.preventDefault()
              setPage('feed')
              loadPosts()
            }}
          >
            Social Feed
          </a>

          <a
            href="#profile"
            onClick={(e) => {
              e.preventDefault()
              setPage('profile')
              loadProfile()
            }}
          >
            Profile
          </a>

          <a
            href="#notifications"
            onClick={async (e) => {
              e.preventDefault()
              setPage('notifications')

              if (!currentUserId) {
                await loadProfile()
              } else {
                await loadNotifications()
              }
            }}
          >
            Notifications
          </a>

        </div>


        {localStorage.getItem('token') ? (
          <button
            className="login-button"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('isAdmin')
              setIsAdmin(false)
              setProfile(null)
              setSkills([])
              setProjects([])
              setPosts([])
              setConnections([])
              setConnectionRequests([])
              setSearchResults([])
              setPage('home')
              alert('Logged out successfully!')
            }}
          >
            Logout
          </button>
        ) : (
          <button
            className="login-button"
            onClick={() => setPage('login')}
          >
            Login
          </button>
        )}

      </nav>

      {page === 'home' && (
        <main className="hero" id="home">
          <p className="tagline">LEARN • CONNECT • GROW</p>

          <h1>
            Connect Through Skills.
            <br />
            <span>Grow Together.</span>
          </h1>

          <p className="description">
            Discover people with similar interests, showcase your skills,
            share projects, and build meaningful professional connections.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => setPage('register')}
            >
              Get Started
            </button>

            <button
              className="secondary-button"
              onClick={() => setPage('login')}
            >
              Explore Skills
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">S</div>
              <h3>Discover Skills</h3>
              <p>Find people who share your interests and goals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">P</div>
              <h3>Showcase Projects</h3>
              <p>Share your work and celebrate your progress.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">C</div>
              <h3>Build Connections</h3>
              <p>Meet learners, mentors, and future teammates.</p>
            </div>
          </div>
        </main>
      )}


      {page === 'login' && (
        <main className="auth-container">
          <form className="auth-card" onSubmit={handleLogin}>
            <h1>Welcome Back</h1>
            <p className="auth-description">
              Login to your SkillConnect account.
            </p>

            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <button className="primary-button auth-submit" type="submit">
              Login
            </button>

            <button
              className="back-button"
              type="button"
              onClick={handleAdminLogin}
            >
              Admin Login
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <button type="button" onClick={() => setPage('register')}>
                Register
              </button>
            </p>

            <button
              className="back-button"
              type="button"
              onClick={() => setPage('home')}
            >
              Back to Home
            </button>
          </form>
        </main>
      )}

      {page === 'register' && (
        <main className="auth-container">
          <form className="auth-card" onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <p className="auth-description">
              Join SkillConnect and grow your skills.
            </p>

            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />

            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />

            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              minLength={6}
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />

            <button className="primary-button auth-submit" type="submit">
              Create Account
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <button type="button" onClick={() => setPage('login')}>
                Login
              </button>
            </p>

            <button
              className="back-button"
              type="button"
              onClick={() => setPage('home')}
            >
              Back to Home
            </button>
          </form>
        </main>
      )}



{/* Skills Page */}
{page === 'skills' && (
  <main className="auth-container">
    <div className="auth-card">
      <h1>My Skills</h1>

      <p className="auth-description">
        Add your skills and showcase what you are learning.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const token = localStorage.getItem('token')

          if (!newSkill.trim()) {
            setSkillsError('Please enter a skill name.')
            return
          }

          try {
            setSkillsError('')

            const response = await fetch(
              `${API_BASE_URL}/api/skills/user/5`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  name: newSkill.trim(),
                }),
              }
            )

            if (!response.ok) {
              throw new Error(
                `Could not add skill. Status: ${response.status}`
              )
            }

            setNewSkill('')
            await loadSkills()
          } catch (error) {
            setSkillsError(error.message)
          }
        }}
      >
        <input
          type="text"
          placeholder="Enter a skill (e.g. Java)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />

        <button type="submit">Add Skill</button>
      </form>

      {skillsError && <p>{skillsError}</p>}

      <h2>Your Skills</h2>

      {skills.length === 0 && !skillsError && (
        <p>No skills added yet.</p>
      )}


      {skills.map((skill) => (
        <div className="feature-card" key={skill.id}>
          {editingSkillId === skill.id ? (
            <>
              <input
                type="text"
                value={editedSkillName}
                onChange={(e) => setEditedSkillName(e.target.value)}
                placeholder="Enter skill name"
              />

              <button
                type="button"
                onClick={async () => {
                  const token = localStorage.getItem('token')

                  if (!editedSkillName.trim()) {
                    setSkillsError('Please enter a skill name.')
                    return
                  }

                  try {
                    setSkillsError('')

                    const response = await fetch(
                      `${API_BASE_URL}/api/skills/${skill.id}`,
                      {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          name: editedSkillName.trim(),
                        }),
                      }
                    )

                    if (!response.ok) {
                      throw new Error(
                        `Could not update skill. Status: ${response.status}`
                      )
                    }

                    setEditingSkillId(null)
                    setEditedSkillName('')
                    await loadSkills()
                  } catch (error) {
                    setSkillsError(error.message)
                  }
                }}
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingSkillId(null)
                  setEditedSkillName('')
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{skill.name}</h3>

              <button
                type="button"
                onClick={() => {
                  setEditingSkillId(skill.id)
                  setEditedSkillName(skill.name)
                  setSkillsError('')
                }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={async () => {
                  const token = localStorage.getItem('token')

                  try {
                    setSkillsError('')

                    const response = await fetch(
                      `${API_BASE_URL}/api/skills/${skill.id}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    )

                    if (!response.ok) {
                      throw new Error(
                        `Could not delete skill. Status: ${response.status}`
                      )
                    }

                    await loadSkills()
                  } catch (error) {
                    setSkillsError(error.message)
                  }
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}



      <button
        className="back-button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}


{/* Projects Page */}
{page === 'projects' && (
  <main className="auth-container">
    <div className="auth-card">
      <h1>My Projects</h1>

      <p className="auth-description">
        Showcase your work, technologies, and project links.
      </p>

      <form onSubmit={handleAddProject}>
        <input
          type="text"
          placeholder="Project title"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({ ...newProject, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Project description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Technologies (e.g. Java, React, MySQL)"
          value={newProject.technologies}
          onChange={(e) =>
            setNewProject({ ...newProject, technologies: e.target.value })
          }
          required
        />

        <input
          type="url"
          placeholder="Project URL (optional)"
          value={newProject.projectUrl}
          onChange={(e) =>
            setNewProject({ ...newProject, projectUrl: e.target.value })
          }
        />

        <button type="submit">Add Project</button>
      </form>


      {projectsError && <p>{projectsError}</p>}

      {!projectsError && projects.length === 0 && (
        <p>No projects found. Add a project through your backend to see it here.</p>
      )}

      {projects.map((project) => (
        <div className="feature-card" key={project.id}>
          {editingProjectId === project.id ? (
            <>
              <input
                type="text"
                placeholder="Project title"
                value={editedProject.title}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Project description"
                value={editedProject.description}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Technologies"
                value={editedProject.technologies}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    technologies: e.target.value,
                  })
                }
              />

              <input
                type="url"
                placeholder="Project URL (optional)"
                value={editedProject.projectUrl}
                onChange={(e) =>
                  setEditedProject({
                    ...editedProject,
                    projectUrl: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={async () => {
                  const token = localStorage.getItem('token')

                  if (!editedProject.title.trim()) {
                    setProjectsError('Please enter a project title.')
                    return
                  }

                  try {
                    setProjectsError('')

                    const response = await fetch(
                      `${API_BASE_URL}/api/projects/${project.id}`,
                      {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          title: editedProject.title.trim(),
                          description: editedProject.description.trim(),
                          technologies: editedProject.technologies.trim(),
                          projectUrl: editedProject.projectUrl.trim(),
                        }),
                      }
                    )

                    if (!response.ok) {
                      throw new Error(
                        `Could not update project. Status: ${response.status}`
                      )
                    }

                    setEditingProjectId(null)
                    await loadProjects()
                  } catch (error) {
                    setProjectsError(error.message)
                  }
                }}
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingProjectId(null)
                  setProjectsError('')
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <p>
                <strong>Technologies:</strong>{' '}
                {project.technologies || 'Not specified'}
              </p>

              {project.projectUrl && (
                <p>
                  <strong>Project link:</strong>{' '}
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingProjectId(project.id)
                  setEditedProject({
                    title: project.title || '',
                    description: project.description || '',
                    technologies: project.technologies || '',
                    projectUrl: project.projectUrl || '',
                  })
                  setProjectsError('')
                }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={async () => {
                  const token = localStorage.getItem('token')

                  if (!window.confirm(`Delete "${project.title}"?`)) {
                    return
                  }

                  try {
                    setProjectsError('')

                    const response = await fetch(
                      `${API_BASE_URL}/api/projects/${project.id}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    )

                    if (!response.ok) {
                      throw new Error(
                        `Could not delete project. Status: ${response.status}`
                      )
                    }

                    await loadProjects()
                  } catch (error) {
                    setProjectsError(error.message)
                  }
                }}
              >
                Delete
              </button>

            </>
          )}
        </div>
      ))}



      <button
        className="back-button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}

{/* Social Feed Page */}
{page === 'feed' && (
  <main className="auth-container">
    <div className="auth-card">
      <h1>Social Feed</h1>

      <p className="auth-description">
        Share your learning journey, ideas, and progress with other students.
      </p>

      {/* Create Post */}
      <form onSubmit={handleAddPost}>
        <textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          maxLength={400}
          required
        />
        <p>{newPostContent.length}/400 characters</p>

        <button type="submit">Create Post</button>
      </form>

      {/* Error Message */}
      {postsError && <p>{postsError}</p>}

      {/* Empty State */}
      {!postsError && posts.length === 0 && (
        <p>No posts yet. Create your first post!</p>
      )}

      {/* Display, Update, and Delete Posts */}
      {posts.map((post) => (
        <div className="feature-card" key={post.id}>
          {editingPostId === post.id ? (
            <>
              <textarea
                value={editedPostContent}
                onChange={(e) => setEditedPostContent(e.target.value)}
                maxLength={400}
                required
              />
              <p>{editedPostContent.length}/400 characters</p>

              <button
                type="button"
                onClick={() => handleUpdatePost(post.id)}
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPostId(null)
                  setEditedPostContent('')
                  setPostsError('')
                }}
              >
                Cancel
              </button>
            </>
          ) : (

            <>
              <p>{post.content}</p>

              <p>
                Likes: {postLikeCounts[post.id] ?? 0}
              </p>

              <button
                type="button"
                onClick={() => handleLikePost(post.id)}
              >
                Like
              </button>

              <h3>Comments</h3>

              {(postComments[post.id] || []).map((comment) => (
                <div key={comment.id}>
                  <p>{comment.content}</p>

                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id, post.id)}
                  >
                    Delete Comment
                  </button>
                </div>
              ))}

              <form onSubmit={(event) => handleAddComment(event, post.id)}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentContent[post.id] || ''}
                  onChange={(event) =>
                    setNewCommentContent((previous) => ({
                      ...previous,
                      [post.id]: event.target.value,
                    }))
                  }
                  required
                />

                <button type="submit">Add Comment</button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setEditingPostId(post.id)
                  setEditedPostContent(post.content || '')
                  setPostsError('')
                }}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeletePost(post.id)}
              >
                Delete
              </button>
            </>

          )}
        </div>
      ))}

      <button
        className="back-button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}


{/* Connections Page */}
{page === 'connections' && (
  <main className="auth-container">
    <div className="auth-card">
      <h1>Connections</h1>

      <p className="auth-description">
        Find students with similar skills, connect with learners, and grow together.
      </p>


      <div className="feature-card">
        <h3>Find Students</h3>

        <p>Search for students by name or skill.</p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            searchStudents()
          }}
        >
          <select
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
          >
            <option value="name">Search by name</option>
            <option value="skill">Search by skill</option>
          </select>

          <input
            type="text"
            placeholder="Enter student name or skill"
            value={studentSearch}
            onChange={(event) => setStudentSearch(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>


      {searchResults.map((student) => {
        const existingConnection = connections.some((connection) => {
          const senderId = connection.sender?.id
          const receiverId = connection.receiver?.id

          return (
            (senderId === currentUserId && receiverId === student.id) ||
            (senderId === student.id && receiverId === currentUserId)
          )
        })

        const existingRequest = connectionRequests.some(
          (request) =>
            request.sender?.id === student.id ||
            request.receiver?.id === student.id
        )

        return (
          <div key={student.id}>
            <p>
              <strong>{student.name}</strong>
            </p>
            <p>{student.email}</p>

            {existingConnection ? (
              <p>Already Connected</p>
            ) : existingRequest ? (
              <p>Connection request already exists</p>
            ) : (
              <button
                type="button"
                onClick={() => handleSendConnectionRequest(student.id)}
              >
                Send Connection Request
              </button>
            )}
          </div>
        )
      })}



        {!connectionsError &&
          studentSearch.trim() &&
          searchResults.length === 0 && (
            <p>No matching students found yet. Click Search to try again.</p>
          )}
      </div>



      <div className="feature-card">
        <h3>Incoming Connection Requests</h3>

        {!connectionsError && connectionRequests.length === 0 && (
          <p>No pending requests.</p>
        )}

        {connectionRequests.map((request) => (
          <div key={request.id}>
            <p>
              <strong>{request.sender?.name || 'Student'}</strong>
            </p>
            <p>{request.sender?.email || ''}</p>

            <button
              type="button"
              onClick={async () => {
                const token = localStorage.getItem('token')

                try {
                  const response = await fetch(
                    `${API_BASE_URL}/api/connections/accept/${request.id}`,
                    {
                      method: 'PUT',
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )

                  if (!response.ok) {
                    throw new Error('Could not accept request.')
                  }

                  await loadConnections()
                } catch (error) {
                  setConnectionsError(error.message)
                }
              }}
            >
              Accept
            </button>

            <button
              type="button"
              onClick={async () => {
                const token = localStorage.getItem('token')

                try {
                  const response = await fetch(
                    `${API_BASE_URL}/api/connections/reject/${request.id}`,
                    {
                      method: 'PUT',
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )

                  if (!response.ok) {
                    throw new Error('Could not reject request.')
                  }

                  await loadConnections()
                } catch (error) {
                  setConnectionsError(error.message)
                }
              }}
            >
              Reject
            </button>
          </div>
        ))}
      </div>



      <div className="feature-card">
        <h3>My Connections</h3>

        {connectionsError && <p>{connectionsError}</p>}

        {!connectionsError && connections.length === 0 && (
          <p>No accepted connections yet.</p>
        )}

        {connections.map((connection) => {
          const otherUser =
            connection.sender?.id === currentUserId
              ? connection.receiver
              : connection.sender

          return (
            <div key={connection.id}>
              <p>
                <strong>{otherUser?.name || 'Student'}</strong>
              </p>
              <p>{otherUser?.email || ''}</p>
              <p>Status: {connection.status}</p>
            </div>
          )
        })}
      </div>

      <button
        className="back-button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}


{/* Admin Dashboard */}
{page === 'admin' && isAdmin && (
  <main className="auth-container">
    <div
      className="auth-card"
      style={{ maxWidth: '900px', width: '100%' }}
    >
      <h1>Admin Dashboard</h1>
      <p>Manage SkillConnect users and posts.</p>
      <button
        type="button"
        onClick={loadAdminData}
      >
        Refresh Data
      </button>

      <h2>Registered Users ({adminUsers.length})</h2>

      {adminUsers.length > 0 ? (
        adminUsers.map((user) => (
          <div
            key={user.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}
          >
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>

            {user.email !== 'admin@skillconnect.com' && (
              <button
                type="button"
                onClick={async () => {
                  if (
                    !window.confirm(
                      `Are you sure you want to delete user ${user.name}?`
                    )
                  ) {
                    return
                  }

                  try {
                    const response = await fetch(
                      `${API_BASE_URL}/api/admin/users/${user.id}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                      }
                    )

                    if (!response.ok) {
                      const message = await response.text()
                      throw new Error(
                        message || 'Failed to delete user.'
                      )
                    }

                    alert('User deleted successfully.')
                    await loadAdminData()
                  } catch (error) {
                    alert(error.message)
                  }
                }}
              >
                Delete User
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No users found, or the data has not loaded yet.</p>
      )}

      <hr />

      <h2>Social Posts ({adminPosts.length})</h2>

      {adminPosts.length > 0 ? (
        adminPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}
          >
            <p>
              <strong>Post ID:</strong> {post.id}
            </p>
            <p>
              <strong>Content:</strong> {post.content}
            </p>
            <p>
              <strong>Posted by:</strong>{' '}
              {post.user?.name || 'Unknown user'}
            </p>

            <button
              type="button"
              onClick={async () => {
                if (
                  !window.confirm(
                    `Are you sure you want to delete post ${post.id}?`
                  )
                ) {
                  return
                }

                try {
                  const response = await fetch(
                    `${API_BASE_URL}/api/admin/posts/${post.id}`,
                    {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                    }
                  )

                  if (!response.ok) {
                    const message = await response.text()
                    throw new Error(
                      message || 'Failed to delete post.'
                    )
                  }

                  alert('Post deleted successfully.')
                  await loadAdminData()
                } catch (error) {
                  alert(error.message)
                }
              }}
            >
              Delete Post
            </button>
          </div>
        ))
      ) : (
        <p>No posts found, or the data has not loaded yet.</p>
      )}

      <button
        className="back-button"
        type="button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}



{/* Profile Page */}
{page === 'profile' && (
  <main className="auth-container">
    <div className="auth-card">
      <h1>My Profile</h1>

      {profileError && <p>{profileError}</p>}

      {profile && !isEditing && (
        <>
          <h2>{profile.name}</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio || 'No bio added yet.'}</p>
          <p><strong>Education:</strong> {profile.education || 'Not added yet.'}</p>
          <p><strong>Location:</strong> {profile.location || 'Not added yet.'}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not added yet.'}</p>

          <button type="button" onClick={startEditing}>
            Edit Profile
          </button>

          <h3>My Skills</h3>
          {skills.length > 0 ? (
            <ul>
              {skills.map((skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          ) : (
            <p>No skills added yet.</p>
          )}

          <h3>My Projects</h3>
          {projects.length > 0 ? (
            <ul>
              {projects.map((project) => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          ) : (
            <p>No projects added yet.</p>
          )}
        </>
      )}

      {profile && isEditing && (
        <form onSubmit={handleProfileUpdate}>
          <label>Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
            required
          />

          <label>Bio</label>
          <textarea
            value={editData.bio}
            onChange={(e) =>
              setEditData({ ...editData, bio: e.target.value })
            }
          />

          <label>Education</label>
          <input
            type="text"
            value={editData.education}
            onChange={(e) =>
              setEditData({ ...editData, education: e.target.value })
            }
          />

          <label>Location</label>
          <input
            type="text"
            value={editData.location}
            onChange={(e) =>
              setEditData({ ...editData, location: e.target.value })
            }
          />

          <label>Phone</label>
          <input
            type="text"
            value={editData.phone}
            onChange={(e) =>
              setEditData({ ...editData, phone: e.target.value })
            }
          />

          <button type="submit">Save Profile</button>

          <button
            type="button"
            onClick={() => {
              setIsEditing(false)
              setProfileError('')
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <button
        className="back-button"
        type="button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}


{/* Notifications Page */}
{page === 'notifications' && (
  <main className="auth-container">
    <div className="auth-card">
      <h1>Notifications</h1>

      {notificationsError && (
        <p>{notificationsError}</p>
      )}

      {!notificationsError && notifications.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {notifications.map((notification) => (
        <div className="feature-card" key={notification.id}>
          <h3>{notification.type || 'Notification'}</h3>

          <p>{notification.message}</p>

          <p>
            Status: {notification.read ? 'Read' : 'Unread'}
          </p>

          {!notification.read && (
            <button
              onClick={() => handleMarkAsRead(notification.id)}
            >
              Mark as Read
            </button>
          )}

        </div>
      ))}

      <button
        className="back-button"
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  </main>
)}


      <footer>
        © 2026 SkillConnect. Learn, connect, and grow together.
      </footer>
    </div>
  )
}

export default App
