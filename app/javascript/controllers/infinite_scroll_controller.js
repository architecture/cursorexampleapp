import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["entries", "pagination"]
  static values = { page: Number }

  initialize() {
    this.pageValue = 1
    this.loading = false
  }

  connect() {
    this.createObserver()
  }

  createObserver() {
    const options = {
      threshold: 0.5
    }
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loading) {
          this.loadMore()
        }
      })
    }, options)

    // Observe the last post
    const lastPost = this.entriesTarget.lastElementChild
    if (lastPost) {
      observer.observe(lastPost)
    }
  }

  async loadMore() {
    this.loading = true
    this.pageValue++

    try {
      const response = await fetch(`/posts?page=${this.pageValue}`, {
        headers: {
          'Accept': 'text/html'
        }
      })
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const newPosts = doc.querySelector('#posts').children

      if (newPosts.length > 0) {
        this.entriesTarget.insertAdjacentHTML('beforeend', Array.from(newPosts).map(post => post.outerHTML).join(''))
        this.createObserver()
      }
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      this.loading = false
    }
  }
} 