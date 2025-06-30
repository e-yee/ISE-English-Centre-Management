# 🧾 Conventional Commit Message Guide <!-- omit in toc -->

This project follows the **Conventional Commits** specification. Writing consistent and meaningful commit messages improves readability, enables automation (e.g., changelogs, versioning), and helps team collaboration.

---

## 📁 Table of Contents <!-- omit in toc -->

- [🧱 Format](#-format)
- [🔤 Types](#-types)
- [🏷️ Scope (Optional)](#️-scope-optional)
- [✍️ Description](#️-description)
- [📝 Body (Optional)](#-body-optional)
- [🔚 Footer (Optional)](#-footer-optional)
- [✅ Examples](#-examples)
- [🔧 Tools](#-tools)
- [📚 References](#-references)

---

## 🧱 Format

Each commit message should follow this structure:

```swift
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

---

## 🔤 Types

| Type        | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| `feat`      | A new feature                                                               |
| `fix`       | A bug fix                                                                   |
| `docs`      | Documentation only changes                                                  |
| `style`     | Code style changes (e.g., formatting, missing semi-colons); no logic change |
| `refactor`  | Refactoring code without changing behavior                                  |
| `perf`      | Performance improvement                                                     |
| `test`      | Adding or updating tests                                                    |
| `build`     | Build system or dependency changes                                          |
| `ci`        | CI/CD configuration changes                                                 |
| `chore`     | Routine changes (e.g., linting, scripts)                                    |
| `revert`    | Revert a previous commit                                                    |

---

## 🏷️ Scope (Optional)

Use a scope to specify the area of the codebase affected:

```scss
feat(auth): implement JWT login
fix(ui): correct button spacing
```

---

## ✍️ Description

- Use the **imperative mood** (e.g., "add" not "added")
- Keep it concise (≤ 70 characters)
- No period at the end

---

## 📝 Body (Optional)

Provide additional context if necessary:

```pgsql
feat(user): add profile UI

This adds a new user profile page displaying basic details.
Integrated it with the user API and added loading states
```

---

## 🔚 Footer (Optional)

Use footers to declare **breaking changes** or reference issues.

### Breaking Change <!-- omit in toc -->

```pgsql
BREAKING CHANGE: login API now requires email instead of username
```

### Issue Reference <!-- omit in toc -->

```nginx
Closes #45
Fixes #102
```

---

## ✅ Examples

### Feature <!-- omit in toc -->

```scss
feat(cart): add checkout button
```

### Fix <!-- omit in toc -->

```scss
fix(auth): resolve login redirect bug
```

### Documentation <!-- omit in toc -->

```scss
docs(readme): update installation steps
```

### Refactor <!-- omit in toc -->

```scss
refactor(api): simplify error handling
```

### Revert <!-- omit in toc -->

```scss
revert: fix(ui): revert margin fix
```

---

## 🔧 Tools

To enforce this convention:

- **commitlint** – Lints commit messages against this format
- **husky** – Adds Git hooks for commit message validation
- **semantic-release** – Automates releases based on commit history

---

## 📚 References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Section Icon](https://emojipedia.org/)
- [AI Chatbox](https://chatgpt.com/c/6860cf21-0b80-8006-8a5e-02567729281d)