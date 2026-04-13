When you open the project in VS Code, you'll see a popup asking to install recommended extensions:
Click "Install All" or install manually:

ESLint (dbaeumer.vscode-eslint)
Prettier (esbenp.prettier-vscode)

To install manually:

Open VS Code
Press Ctrl+Shift+X (or Cmd+Shift+X on Mac)
Search for "ESLint" → Install
Search for "Prettier - Code formatter" → Install

Reload VS Code
After installing extensions, reload VS Code (press Ctrl+Shift+P → type "Reload Window")

✨ Auto-Linting on Save
Once setup is complete, your code will automatically:
✅ Format on save - Prettier will auto-format your code
✅ Fix ESLint issues - Auto-fixable lint errors are corrected
✅ Consistent style - Everyone's code looks the same
What Happens When You Save:

Prettier formats the code (spacing, quotes, semicolons, etc.)
ESLint fixes auto-fixable issues (unused imports, etc.)
File is saved with clean, consistent code