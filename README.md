# 💕 Love App — Setup Guide

A romantic quiz page for your girlfriend, with a dodging "No" button and photo rewards!

---

## 📁 Project Structure

```
love-app/
├── server.js            ← Node.js server (no dependencies needed!)
├── questions.txt        ← Your questions, one per line
├── public/
│   ├── index.html       ← The webpage
│   └── images/          ← Put your photos here
```

---

## 🚀 How to Run

1. **Open the folder in VS Code**

2. **Add your questions** — open `questions.txt` and write one question per line:
   ```
   Do you think about me when I'm not around?
   Am I your favourite person in the whole world?
   Do my hugs make everything better?
   ```

3. **Add your photos** — copy your photos into the `public/images/` folder.
   Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

4. **Start the server** — open the VS Code terminal and run:
   ```bash
   node server.js
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 🎮 How It Works

- Questions are loaded from `questions.txt` automatically
- Photos are picked randomly from `public/images/` as rewards
- The **"No" button** runs away from the cursor every time she tries to click it
- Clicking **"Yes"** shows a photo of you two for 5 seconds, then moves to the next question
- A beautiful progress bar shows how far along she is
- A sweet ending message appears when all questions are done

---

## ✏️ Customisation Tips

- **Change the ending message** — edit the `done-title` text in `index.html`
- **Change reward captions** — edit the `captions` array in the `<script>` section
- **Change the countdown** — find `let secs = 5` and change the number
- **Add more questions** — just add more lines to `questions.txt`, no code changes needed!

---

Enjoy! 💕
