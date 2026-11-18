# Surface: mobile (iOS, Android, React Native, small web viewports)

- **Platform conventions first.** iOS: Human Interface Guidelines (navigation bars, tab bars, sheets, SF Symbols, Dynamic Type). Android: Material 3 conventions. Cross-platform: respect each platform's back behavior and system fonts unless the brand mandates otherwise.
- **Tap targets ≥ 44×44pt (iOS) / 48×48dp (Android).** Spacing between targets ≥ 8px.
- **Safe areas**: respect notches, home indicator, and keyboard insets.
- **Thumb reach**: primary actions in the lower half; destructive actions away from frequent ones.
- **Text scales**: support Dynamic Type / font scaling; layouts must reflow at 200% text.
- **Motion**: native-feeling springs for gestures and sheets; keep animation off the JS thread in React Native.
- **Dark mode** is required, designed as its own palette.
- **Offline and slow network** states are designed, not afterthoughts.
