# Solver de Derivadas de Cálculo Web

Aplicación web didáctica para resolver derivadas paso a paso, aplicar regla de la cadena, derivación implícita, logaritmos, funciones trigonométricas inversas y análisis de pendientes.

El proyecto convierte ejercicios de cálculo diferencial en un solver visual con explicación guiada, evaluación de pendientes, gráfica de función/derivada, modo examen e historial local.

---

## Objetivo del proyecto

Crear una herramienta interactiva para practicar derivadas y entender el procedimiento aplicado en cada ejercicio.

El sistema permite:

- Escribir una función en una entrada tipo solver.
- Reconocer ejercicios guiados.
- Mostrar función original.
- Mostrar derivada final.
- Explicar el procedimiento paso a paso.
- Evaluar la pendiente en un punto.
- Graficar función y derivada.
- Graficar curvas implícitas.
- Dibujar recta tangente.
- Copiar procedimiento.
- Guardar historial local.
- Resolver un modo examen.

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Canvas API
- MathJax
- LocalStorage
- GitHub Pages

---

## Estructura del repositorio

```text
solver-derivadas-calculo-web/
├── index.html
├── styles.css
├── app.js
└── README.md
```

---

## Ejercicios incluidos

### Regla de la cadena con raíz

```text
f(x) = √(3 - x²)
f'(x) = -x / √(3 - x²)
```

### Logaritmo natural con raíz

```text
f(x) = ln(√(3 - x²))
f'(x) = -x / (3 - x²)
```

### Derivación implícita

```text
y³ + y² - 5y - x² = -4
dy/dx = 2x / (3y² + 2y - 5)
```

### Arc cot

```text
f(x) = arccot((1 + x) / (1 - x))
f'(x) = -1 / (1 + x²)
```

### Arc tan

```text
f(x) = arctan(3x²)
f'(x) = 6x / (1 + 9x⁴)
```

### Regla de potencia

```text
f(x) = x³ - 4x
f'(x) = 3x² - 4
```

---

## Entrada tipo solver

La aplicación reconoce entradas como:

```text
sqrt(3-x^2)
ln(sqrt(3-x^2))
arctan(3x^2)
arccot((1+x)/(1-x))
y^3+y^2-5y-x^2=-4
x^3-4x
```

---

## Modo examen

Incluye preguntas sobre:

- Regla de la cadena.
- Derivada de arctan.
- Derivación implícita.
- Derivada de ln(u).

---

## Cómo usar el proyecto

Abre el archivo:

```text
index.html
```

en cualquier navegador moderno.

No requiere instalación de dependencias locales.

---

## Publicación en GitHub Pages

Este proyecto puede publicarse como sitio estático desde GitHub Pages.

Pasos generales:

1. Subir los archivos al repositorio.
2. Entrar a **Settings**.
3. Abrir **Pages**.
4. Seleccionar la rama `main`.
5. Guardar.
6. Abrir el enlace publicado por GitHub.

---

## Enfoque académico

Este proyecto convierte ejercicios de cálculo diferencial en una experiencia interactiva.

El objetivo es que el usuario pueda resolver, visualizar y comprobar derivadas, no sólo consultar el resultado final.

---

## Autora

**Sofía Pacheco**  
GitHub: [SofiPv](https://github.com/SofiPv)

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.
