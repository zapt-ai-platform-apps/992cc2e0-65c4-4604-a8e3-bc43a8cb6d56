# Presentation Content Generator

An intelligent tool that helps users create structured content for presentations. Users can provide the title, topics, and number of slides to generate bullet-pointed content for each slide. The app also supports voice input for topic entry and allows downloading the content as a Word or PDF document.

## Features

[See Features](features.md)

## External APIs Used

- **Supabase**: Used for user authentication and managing user sessions.
- **OpenAI GPT API**: Generates structured, bullet-pointed content for each slide based on user input.
- **Google Speech-to-Text API**: Converts voice input into text for topic entry.
- **Resend**: Handles sending emails, such as magic links for authentication.
- **Umami Analytics**: Tracks website analytics and user interactions.

## Environment Variables

[View Environment Variables](environment-variables.md)

## Design Details

Refer to the [Design Documentation](docs/design/design-details.md) for information on the color palette, fonts, and other design elements used in the app.

## Getting Started

[See Getting Started Guide](getting-started.md)

## Deployment

The app is configured to be deployed using Vercel. Ensure all environment variables are set in Vercel's dashboard before deploying.

## License

This project is licensed under the MIT License.