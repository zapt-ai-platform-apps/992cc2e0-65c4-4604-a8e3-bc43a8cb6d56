# Design Details

## Color Palette

- **Primary Color**: #6B46C1 (Purple)
- **Secondary Color**: #4299E1 (Blue)
- **Accent Color**: #38A169 (Green)
- **Background Color**: #F7FAFC (Light Gray)
- **Text Color**: #4A5568 (Dark Gray)

## Fonts

- **Primary Font**: Inter, sans-serif
- **Secondary Font**: Roboto Mono, monospace

## Typography

- **Headings**:
  - H1: 2.25rem, Bold
  - H2: 1.875rem, Bold
  - H3: 1.5rem, Semi-Bold

- **Body Text**:
  - Regular: 1rem
  - Small: 0.875rem

## Component Styles

- **Buttons**:
  - Rounded corners (large radius)
  - Hover effects with slight scaling
  - Shadows for depth

- **Inputs**:
  - Rounded borders
  - Focus states with ring effects

- **Cards**:
  - Rounded corners
  - Shadow for elevation
  - Padding for content spacing

## Responsive Design

- **Mobile-First Approach**:
  - Ensure all components are accessible and visually appealing on small screens.
  - Utilize Tailwind's responsive utilities to adjust layouts for larger screens.

- **Breakpoints**:
  - **sm**: 640px
  - **md**: 768px
  - **lg**: 1024px
  - **xl**: 1280px

## Accessibility

- Ensure sufficient color contrast between text and background.
- Use semantic HTML elements.
- Include ARIA labels where necessary.
- Ensure focus states are prominent for keyboard navigation.

## Icons and Images

- Utilize SVG icons for scalability and performance.
- Maintain consistent iconography style throughout the app.

## Layout

- **Header**:
  - App title on the left.
  - Sign Out button on the right.

- **Main Content**:
  - Input forms for presentation details.
  - Generated content preview section.
  - Download and Preview buttons.

- **Footer**:
  - "Made on ZAPT" badge linking to [zapt.ai](https://www.zapt.ai).

## Shadows and Elevation

- Use subtle shadows to differentiate between layers and emphasize focus.
- Avoid heavy shadows that can distract users.

## Animations

- Smooth transitions for hover and active states.
- Fade-in effects for modals and dynamic content.

## Consistency

- Maintain uniform spacing and sizing across all components.
- Use a consistent border radius for all rounded elements.