# 🧠 Git Tutorial for Beginners

Welcome to the beginner-friendly Git tutorial! This guide covers the most essential Git commands and workflows for everyday development.

---

## 📁 Table of Contents

- [🔧 Git Setup](#-git-setup)
- [📥 Clone a Repository](#-clone-a-repository)
- [📄 Check Status](#-check-status)
- [📝 Commit Changes](#-commit-changes)
- [⬆️ Push Changes](#️-push-changes)
- [⬇️ Pull Updates](#-pull-updates)
- [🌱 Branching](#-branching)
- [🔀 Merging Branches](#-merging-branches)
- [🍒 Cherry-pick Commits](#-cherry-pick-commits)
- [📌 Helpful Tips](#-helpful-tips)

---

## 🔧 Git Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## 📥 Clone a Repository

```bash
git clone <repository-url>
```

**Example:**

```bash
git clone https://github.com/yourname/project.git
```

---

## 📄 Check Status

Shows the current branch status and changes.

```bash
git status
```

---

## 📝 Commit Changes

**1. Stage files:**

```bash
git add .
# or
git add <filename>
```

**2. Commit with a message:**

```bash
git commit -m "feat: add login feature"

# Read conventional_commits.md
```

---

## ⬆️ Push Changes

```bash
git push origin <branch-name>
```

**Example:**

```bash
git push origin main
```

---

## ⬇️ Pull Updates

```bash
git pull
# or from a specific branch
git pull origin main
```

---

## 🌱 Branching

**Create a branch:**

```bash
git branch <branch-name>
```

**Switch to it:**

```bash
git checkout <branch-name>
```

**Create and switch in one line:**

```bash
git checkout -b <branch-name>
```

---

## 🔀 Merging Branches

**1. Switch to the target branch (e.g., main):**

```bash
git checkout main
```

**2. Merge another branch into it:**

```bash
git merge feature/login
```

---

## 🍒 Cherry-pick Commits

**Apply a specific commit from one branch to another:**

```bash
git cherry-pick <commit-hash>
```

**Example:**

```bash
git checkout main
git cherry-pick 3f9c0d2
```

**Abort if conflicts:**

```bash
git cherry-pick --abort
```

---

## 📌 Helpful Tips

- **View commit log:**

```bash
git log --oneline --graph --all
```

- **Remove tracked file:**

```bash
git rm <filename>
```

- **Undo last commit (soft):**

```bash
git reset --soft HEAD~1
```

- **Rename a branch:**

```bash
git branch -m new-name
```

---

## 🏁 Conclusion
This tutorial gives you the core commands to work efficiently with Git in most team projects. For best practices, use **conventional commit messages** and regularly **pull from remote** before pushing.