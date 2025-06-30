# 📦 Shadcn/UI – Modern UI Components for React <!-- omit in toc -->

Shadcn/UI is a customizable component library built with Radix UI, Tailwind CSS, and TypeScript. It's not a traditional npm package – instead, you copy components into your codebase, giving you full control and flexibility.

---

## 📁 Table of Contents <!-- omit in toc -->

- [✨ Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [📦 Add Components](#-add-components)
- [🛠 Customize Components](#-customize-components)
- [📚 Recommended Components to Try](#-recommended-components-to-try)
- [🛟 Resources](#-resources)

---

## ✨ Features

- 🧱 Built on Radix UI Primitives
- 🎨 Styled with Tailwind CSS
- ⚡ Fully typed with TypeScript
- 🛠️ Copy-paste components into your own app
- 💡 Easily customizable to match your design system

---

## 🚀 Getting Started

Remember to read Shadcn docs: https://ui.shadcn.com/docs/installation

---

## 📦 Add Components

To add a component, run:

```bash
npx shadcn@latest add button
```

This command will:
- Fetch the component from shadcn/ui
- Copy it into your project under `components/ui/button.tsx`
- Add all required dependencies (Radix, etc.)

---

## 🛠 Customize Components

All components are copied into your repo, so you can freely modify styles, logic, or animations.
Example: change button style in `components/ui/button.tsx`:

```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click Me
</button>
```

---

## 📚 Recommended Components to Try

- `button`
- `input`
- `dialog`
- `dropdown-menu`
- `toast`
- `tooltip`
- `card`
- `badge`

---

## 🛟 Resources

- Official site: https://ui.shadcn.com/
- GitHub: https://github.com/shadcn/ui
- Tailwind CSS: https://tailwindcss.com