# 📖 66 Books: The Testament Challenge

**66 Books** is an elegant, fast-paced educational web game designed to sharpen a player’s knowledge of the Bible's structure. Categorize the books of the Bible into the Old or New Testament before time runs out!

---

## 🎮 Game Overview

The objective is simple but challenging: identify whether a displayed Bible book belongs to the **Old Testament** or the **New Testament**. Players must progress through **50 levels**, correctly identifying **12 books per level**.

### Key Features:
* **Dynamic Difficulty:** Choose between Easy, Normal, and Hard modes to adjust the level timer.
* **Persistent High Scores:** Tracks your best performance using browser `localStorage`.
* **Audio Controls:** Toggle background music to suit your focus.
* **Interactive Guide:** A built-in "How to Play" modal for new users.
* **Mobile-First Design:** Fully responsive UI that feels native on mobile, tablet, and desktop.

---

## 🎨 Design & Aesthetic

The UI is inspired by a classical, "parchment and gold" theme, utilizing a sophisticated color palette:
* **Old Testament:** Muted Sage Green (`#6B8E7D`)
* **New Testament:** Rust / Earthy Brown (`#A87C6F`)
* **Accents:** Khaki Gold (`#CCA068`) and Cream Parchment (`#F8F2E2`)

The background features a quadrant-based geometric design that balances modern minimalism with traditional motifs.

---

## 🛠️ Technical Stack

* **HTML5:** Structured semantic markup for accessibility.
* **CSS3:** Mobile-first approach using **Flexbox** and **CSS Grid** for seamless responsiveness.
* **Vanilla JavaScript:** Clean, modular code for game logic, timer management, and state handling (no external libraries required).

---

## 🚀 How to Run the Project

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/yourusername/66-books-challenge.git](https://github.com/yourusername/66-books-challenge.git)
    ```
2.  **Open the Game:**
    Navigate to the project folder and open `index.html` in any modern web browser.
3.  **(Optional) Background Music:**
    Place your audio file in the project directory and update the `src` attribute in the `<audio>` tag within `index.html`.

---

## 📂 Project Structure

```text
├── index.html      # Game structure and UI components
├── style.css       # Responsive design and mobile-first styles
├── script.js      # Core game logic, timer, and settings
└── assets/         # Images, icons, and audio files
