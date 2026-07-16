# Engineering & Coding Standards

This document establishes the coding conventions, TypeScript typing rules, design patterns, and quality guidelines for the HomeCare Grid Marketplace repository.

---

## 1. Core Principles

- **SOLID Code**: Maintain Single Responsibility on all files; utilize Interface Segregation; decouple system layers.
- **DRY (Don't Repeat Yourself)**: Abstract common actions (like currency calculations or date conversions) into unified helper files in `/utils`.
- **YAGNI (You Aren't Gonna Need It)**: Do not create placeholder systems or speculative APIs. Build exactly what is specified.

---

## 2. TypeScript & Imports Standards

- **Strict Type Checking**: Avoid any use of `any` types. Explicitly define parameter and return types for all functions, repositories, and handlers.
- **Named Imports Only**: Do not use wildcard imports (e.g., `import * as React`). Use explicit named imports.
- **Top-Level Imports**: Place all import declarations at the very top of files, ordered logically (Frameworks -> Core Libraries -> Repositories/Services -> Shared Helpers -> Component Styles).
- **Standard Enums**: Use standard TypeScript `enum` blocks for status matrices. Do not use `const enum`.

---

## 3. UI and Styling Conventions

- **Tailwind Only**: Style all layouts, cards, buttons, and visual containers exclusively using Tailwind CSS classes. Inline `style` elements are forbidden.
- **Animation Purpose**: Use `motion` components with balanced transition timings (e.g., 200ms ease-in-out) for hover feedback and screen transitions. Avoid excessive animations.
- **Accessibility (WCAG 2.2)**:
  - All visual content must maintain a color contrast ratio of at least 4.5:1.
  - Interactive components must feature descriptive `aria-label` tags and support keyboard navigation (Tab indices).
  - Images must always provide informative `alt` descriptors.
- **Adaptive Sizing**: Utilize container-queries or responsive prefixes (`sm:`, `md:`, `lg:`) to ensure interfaces render correctly across mobile and ultra-wide monitor views.
