// fix-imports.js
import fs from "fs";
import path from "path";

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      // Add .js extension to relative imports without extensions
      content = content.replace(
        /(import\s.*from\s+['"])(\.\/[^'"]+)(['"])/g,
        (match, p1, p2, p3) => {
          if (!p2.endsWith(".js")) return `${p1}${p2}.js${p3}`;
          return match;
        }
      );
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

fixImports(path.resolve("./dist"));
