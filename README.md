# 🎨 AutoFilter.js

A lightweight, vanilla JavaScript library for creating beautiful, animated filter layouts. Filter and search through content with smooth animations and responsive layouts - no dependencies required! 🚀

## ✨ Features

- 🔲 **Masonry Layout**: Responsive grid layout with customizable columns
- 🎯 **Multiple Filter Types**: Button/link filtering and search input support
- ✨ **Smooth Animations**: Beautiful transitions with customizable duration and easing
- 📱 **Fully Responsive**: Adaptive columns based on breakpoints
- 🔍 **URL Parameter Support**: Share filtered states via URL
- ⚡ **Performance Optimized**: Uses CSS transforms and requestAnimationFrame
- 🎨 **Customizable**: Extensive configuration options
- 🌈 **Accessibility**: Supports reduced motion preferences

## 📦 Installation

1. Include the required files:
```html
<link rel="stylesheet" href="autofilter.css">
<script src="autofilter.js"></script>
```

2. Add the HTML structure:
```html
<!-- Filter Controls -->
<div class="af-controls">
  <div class="af-filter-group">
    <button class="af-button" data-filter="">All</button>
    <button class="af-button" data-filter="red">Red</button>
  </div>
  <div class="af-filter-group">
    <input type="text" class="af-input" data-filter placeholder="Search...">
  </div>
</div>

<!-- Filter Container -->
<div class="af-container">
  <div class="af-item" data-tags="red">
    <div class="af-item__content">
      <!-- Your content here -->
    </div>
  </div>
</div>
```

3. Initialize AutoFilter:
```javascript
const filter = new AutoFilter({
  // your options here
});
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filterSelector` | `string` | `"[data-filter]"` | Selector for filter buttons and inputs |
| `targetSelector` | `string` | `".af-item"` | Selector for filterable items |
| `activeButtonClass` | `string` | `"af-button--active"` | Class for active filter buttons |
| `hiddenClass` | `string` | `"af-hidden"` | Class applied to hidden items |
| `minChars` | `number` | `3` | Minimum characters for input filtering |
| `caseSensitive` | `boolean` | `false` | Enable case-sensitive filtering |
| `subString` | `boolean` | `false` | Enable substring matching |
| `urlSearchParam` | `string\|null` | `null` | URL parameter name for filter state |
| `debounceDelay` | `number` | `250` | Debounce delay for input filtering (ms) |

### 🎭 Animation Options

```javascript
animation: {
  duration: 400,                              // Animation duration in ms
  easing: "cubic-bezier(0.4, 0, 0.2, 1)"     // CSS easing function
}
```

### 📐 Layout Options

```javascript
layout: {
  gutter: 20,                    // Gap between items in pixels
  columnsBreakpoints: {          // Responsive breakpoints
    1200: 3,                     // 3 columns above 1200px
    768: 2,                      // 2 columns between 768px and 1200px
    0: 1                         // 1 column below 768px
  }
}
```

### 🎯 Event Callbacks

```javascript
{
  onFilter: (filterValue, matchFound) => {
    // Called after filtering
  },
  onReset: () => {
    // Called when filters are reset
  }
}
```

## 🎮 Usage Examples

### Basic Implementation
```javascript
const filter = new AutoFilter();
```

### Custom Configuration
```javascript
const filter = new AutoFilter({
  minChars: 2,
  subString: true,
  animation: {
    duration: 300,
    easing: "ease-in-out"
  },
  layout: {
    gutter: 15,
    columnsBreakpoints: {
      1400: 4,
      1000: 3,
      700: 2,
      0: 1
    }
  },
  urlSearchParam: "category"
});
```

### With Callbacks
```javascript
const filter = new AutoFilter({
  onFilter: (value, found) => {
    console.log(`Filtered by: ${value}, matches found: ${found}`);
  },
  onReset: () => {
    console.log("Filters reset");
  }
});
```

## 🎨 Styling

AutoFilter comes with a default stylesheet (`autofilter.css`) that provides a clean, modern look. All styles use the `af-` prefix and can be customized to match your design:

```css
.af-container { /* Container styles */ }
.af-item { /* Item styles */ }
.af-button { /* Button styles */ }
.af-input { /* Input styles */ }
```

## 🚀 Methods

| Method | Description |
|--------|-------------|
| `filter(value, isInputFilter)` | Apply a filter value |
| `showAll()` | Reset filters and show all items |
| `updateLayout()` | Recalculate and update layout |
| `destroy()` | Clean up and remove functionality |

## 🌟 Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ CSS Grid and Flexbox support
- ✅ ResizeObserver support
- 🎨 Graceful fallbacks for older browsers

## 📱 Responsive Design

AutoFilter automatically adapts to different screen sizes:
- 📺 Desktop: 3 columns (default)
- 💻 Tablet: 2 columns
- 📱 Mobile: 1 column

## 🎯 Performance Tips

1. 🚀 Use `will-change: transform, opacity` sparingly
2. ⚡ Leverage CSS transforms for animations
3. 🎨 Implement debouncing for search inputs
4. 📱 Optimize images and content within items

## 📄 License

Released under the MIT License. Feel free to use in personal and commercial projects! 🎉