import fs from "fs-extra";

["package.json", "README.md", "LICENSE"].forEach(file =>
    fs.copySync(file, `dist/${file}`)
);
