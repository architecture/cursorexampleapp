import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["notification"]

  connect() {
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.close()
    }, 5000)
  }

  close() {
    this.notificationTarget.classList.add("translate-x-full")
    setTimeout(() => {
      this.element.remove()
    }, 300)
  }
} 