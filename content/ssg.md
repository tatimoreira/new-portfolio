# Building a SSG in Rust for my personal blog 

My intention in developing a static site generator to build my personal blog is to document my way to learn Rust and start once and for all my writing journey.

## Static Side Generator
A SGG’s are system engines that use text input files to generate static pages.

## Development:
### General idea
- Input markdonw to the engine
- Having predefined templates to match that input 
- Output the HTML result
- Generate a graphql enpoint to serve the generated pages/posts to a client
- Consume the graphql enpoints into a Remix client (my personal web page)
- Render the list of posts and the post details

I decided to use [Tera](https://docs.rs/tera/latest/tera/) as template engine. I have a base template and a post template which extends from base and builds the post from a content folder which contains md files.
I also added a graphql handler using [async_graphql](https://docs.rs/async-graphql/latest/async_graphql/) so in this way I can consume them and use them in my Remix portfolio as the client.