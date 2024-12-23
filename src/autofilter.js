/**
 * Vanilla AutoFilter
 * 
 * By: HamidReza Yazdani
 */
class AutoFilter {
  constructor(options) {
    this.defaults = {
      filterSelector: "[data-filter]",
      targetSelector: ".af-item",
      activeButtonClass: "af-button--active",
      hiddenClass: "af-hidden",
      minChars: 3,
      caseSensitive: false,
      subString: false,
      urlSearchParam: null,
      animation: {
        duration: 400,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      layout: {
        gutter: 20,
        columnsBreakpoints: {
          1200: 3,
          768: 2,
          0: 1,
        },
      },
      debounceDelay: 250,
      onFilter: null,
      onReset: null,
    };

    this.settings = this.mergeDeep(this.defaults, options);
    this.init();
  }

  mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  init() {
    this.container = document.querySelector(".af-container");
    this.items = Array.from(
      document.querySelectorAll(this.settings.targetSelector)
    );
    this.activeFilter = "";

    // Initialize layout
    this.initLayout();

    // Setup event listeners
    this.setupEventListeners();

    // Apply initial filters if any
    this.applyInitialFilters();
  }

  initLayout() {
    // Setup ResizeObserver
    this.resizeObserver = new ResizeObserver(
      this.debounce(() => {
        this.updateLayout();
      }, 100)
    );

    if (this.container) {
      this.resizeObserver.observe(this.container);
    }

    // Initial layout update
    this.updateLayout();
  }

  setupEventListeners() {
    // Button filters
    const buttons = document.querySelectorAll(
      `${this.settings.filterSelector}:not(input)`
    );
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const filterValue = btn.getAttribute("data-filter");

        // Update active button state
        buttons.forEach((b) =>
          b.classList.remove(this.settings.activeButtonClass)
        );
        btn.classList.add(this.settings.activeButtonClass);

        this.filter(filterValue);
      });
    });

    // Input filters
    const inputs = document.querySelectorAll(
      `${this.settings.filterSelector}[type="text"]`
    );
    inputs.forEach((input) => {
      input.addEventListener(
        "input",
        this.debounce((e) => {
          const value = e.target.value.trim();
          if (value.length >= this.settings.minChars || value.length === 0) {
            this.filter(value, true);
          }
        }, this.settings.debounceDelay)
      );
    });
  }

  updateLayout() {
    if (!this.container || !this.items.length) return;

    const containerWidth = this.container.offsetWidth;
    const columns = this.getColumnsCount(containerWidth);
    const gutter = this.settings.layout.gutter;
    const columnWidth = (containerWidth - gutter * (columns - 1)) / columns;

    // Initialize column heights
    const columnHeights = Array(columns).fill(0);

    // Position visible items
    this.items.forEach((item) => {
      if (!item.classList.contains(this.settings.hiddenClass)) {
        // Find shortest column
        const shortestColumn = columnHeights.indexOf(
          Math.min(...columnHeights)
        );

        // Calculate position
        const x = shortestColumn * (columnWidth + gutter);
        const y = columnHeights[shortestColumn];

        // Set item width
        item.style.width = `${columnWidth}px`;

        // Apply position with transition
        item.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        // Update column height
        columnHeights[shortestColumn] += item.offsetHeight + gutter;
      }
    });

    // Update container height to match tallest column
    const containerHeight = Math.max(...columnHeights) || 0;
    this.container.style.height = `${containerHeight}px`;
  }

  getColumnsCount(containerWidth) {
    const breakpoints = this.settings.layout.columnsBreakpoints;
    const sortedBreakpoints = Object.keys(breakpoints)
      .map(Number)
      .sort((a, b) => b - a);

    for (const breakpoint of sortedBreakpoints) {
      if (containerWidth > breakpoint) {
        return breakpoints[breakpoint];
      }
    }

    return breakpoints[0];
  }

  filter(filterValue, isInputFilter = false) {
    if (filterValue === "" && !isInputFilter) {
      this.showAll();
      return true;
    }

    const normalizedFilter = this.settings.caseSensitive
      ? filterValue
      : filterValue.toLowerCase();

    let matchFound = false;

    // First pass: determine visibility
    this.items.forEach((item) => {
      const tags = item.getAttribute("data-tags");
      let valid = false;

      if (tags) {
        const tagList = this.settings.caseSensitive
          ? tags.split(",").map((tag) => tag.trim())
          : tags.split(",").map((tag) => tag.trim().toLowerCase());

        if (isInputFilter) {
          // For input filters, handle empty value as show all
          if (normalizedFilter === "") {
            valid = true;
          } else {
            valid = this.settings.subString
              ? tagList.some((tag) => tag.includes(normalizedFilter))
              : tagList.includes(normalizedFilter);
          }
        } else {
          valid = tagList.includes(normalizedFilter);
        }
      }

      if (valid) {
        matchFound = true;
      }

      // Apply visibility change
      this.toggleElementVisibility(item, valid);
    });

    // Store active filter
    this.activeFilter = filterValue;

    // Update URL if needed
    if (this.settings.urlSearchParam) {
      this.updateURL(filterValue);
    }

    // Update layout after visibility changes
    requestAnimationFrame(() => {
      this.updateLayout();
    });

    // Trigger callback
    if (typeof this.settings.onFilter === "function") {
      this.settings.onFilter(filterValue, matchFound);
    }

    return matchFound;
  }

  toggleElementVisibility(element, show) {
    if (show) {
      element.classList.remove(this.settings.hiddenClass);
      element.style.transitionDelay = "0ms";
    } else {
      element.classList.add(this.settings.hiddenClass);
      element.style.transitionDelay = "0ms";
      element.style.transform = "scale(0.8)";
    }
  }

  showAll() {
    this.items.forEach((item) => {
      this.toggleElementVisibility(item, true);
    });

    // Reset active filter
    this.activeFilter = "";

    // Update URL if needed
    if (this.settings.urlSearchParam) {
      this.updateURL("");
    }

    // Update layout
    requestAnimationFrame(() => {
      this.updateLayout();
    });

    // Update button states
    const buttons = document.querySelectorAll(
      `${this.settings.filterSelector}:not(input)`
    );

    buttons.forEach((btn) => {
      if (btn.getAttribute("data-filter") === "") {
        btn.classList.add(this.settings.activeButtonClass);
      } else {
        btn.classList.remove(this.settings.activeButtonClass);
      }
    });

    // Trigger callback
    if (typeof this.settings.onReset === "function") {
      this.settings.onReset();
    }
  }

  applyInitialFilters() {
    let initialFilter = "";

    // Check URL parameter
    if (this.settings.urlSearchParam) {
      const params = new URLSearchParams(window.location.search);
      initialFilter = params.get(this.settings.urlSearchParam) || "";
    }

    // Apply filter if found
    if (initialFilter) {
      this.filter(initialFilter);

      // Update button state if applicable
      const button = document.querySelector(`[data-filter="${initialFilter}"]`);
      if (button) {
        button.classList.add(this.settings.activeButtonClass);
      }
    } else {
      this.showAll();
    }
  }

  updateURL(filterValue) {
    if (!this.settings.urlSearchParam) return;

    const url = new URL(window.location);

    if (filterValue) {
      url.searchParams.set(this.settings.urlSearchParam, filterValue);
    } else {
      url.searchParams.delete(this.settings.urlSearchParam);
    }

    window.history.pushState({}, "", url);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  destroy() {
    // Remove resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Remove styles
    this.items.forEach((item) => {
      item.style.width = "";
      item.style.transform = "";
      item.classList.remove(this.settings.hiddenClass);
    });

    // Reset container
    if (this.container) {
      this.container.style.height = "";
    }
  }
}

// Export for different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = AutoFilter;
} else if (typeof define === "function" && define.amd) {
  define([], function () {
    return AutoFilter;
  });
} else {
  window.AutoFilter = AutoFilter;
}
