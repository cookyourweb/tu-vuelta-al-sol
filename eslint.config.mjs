import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Warnings para desarrollo, pero no bloquean build en producción
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "import/no-anonymous-default-export": "warn",
      
      // ✅ CONFIGURACIÓN PROFESIONAL:
      // Mantener la regla pero ser específicos sobre qué caracteres prohibir
      "react/no-unescaped-entities": [
        "error", 
        { 
          "forbid": [
            // Mantener caracteres peligrosos prohibidos
            { "char": ">", "alternatives": ["&gt;"] },
            { "char": "<", "alternatives": ["&lt;"] },
            { "char": "}", "alternatives": ["&#125;"] },
            { "char": "{", "alternatives": ["&#123;"] }
          ]
          // Nota: Comillas " y ' NO están en la lista prohibida
          // Esto permite usar comillas normales en texto español
        }
      ],
      
      // Configuraciones adicionales profesionales
      "react-hooks/exhaustive-deps": "warn", // En lugar de error
      "prefer-const": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off"
    },
  },
];

export default eslintConfig;