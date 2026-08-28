const getSavedTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    // system preference fallback
    return window.matchMedia('(prefers-color-scheme: dark').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
};

export const initialState = {
  theme: getSavedTheme(),
};

export function themeReducer(state, action) {
  switch (action.type) {
    case 'theme/change':
      return {
        theme: action.payload,
      };
    default:
      throw new Error('Theme action gone wrong');
  }
}
