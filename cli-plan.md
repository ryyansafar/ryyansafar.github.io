# 🚀 CLI Implementation Plan: `ryyan-ui`

The goal is to create a CLI that allows users to run `npx ryyan-ui add <component>` to instantly add technical primitives to their own projects.

## 🏗 Proposed Architecture

### 1. `cli/` Package
A lightweight Node.js CLI that:
- Uses `commander` for terminal subcommands.
- Fetches component definitions from a JSON "registry" hosted on GitHub.
- Handles file system operations to install the component and its dependencies.

### 2. Registry Structure
I will create a `registry/` folder in the main repo containing:
- `index.json`: A manifest of all available components.
- Individual `.json` files for each component (code + metadata).

## 📂 Proposed File Structure
```text
/Users/rybosafar/portfolio/
  cli/
    package.json        # defines the `ryyan-ui` binary
    bin/index.js        # the CLI logic
  public/registry/      # The live registry (hosted on your portfolio site)
    index.json
    cursor-spring.json
```

## 🚀 Execution Steps
1. **Initialize CLI**: Create the `cli` folder and `package.json`.
2. **Build Registry**: Extract component code into a JSON-based registry format.
3. **Core CLI Logic**: Implement the `add` command.
4. **Publishing Help**: Guide you through `npm login` and `npm publish`.

## ⚠️ User Review Required
- **Package Name**: Is `ryyan-ui` the final name? If it's taken on npm, we may need `@ryyansafar/ui`.
- **Target Path**: By default, I'll install components into `@/components/ui/`. Does this match your preference?
