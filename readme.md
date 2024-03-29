# next-app-mikro-orm-trpc-template

This template implements minimal architecture on [TypeScript](https://www.typescriptlang.org/) + [Next.js](https://nextjs.org/) + [MikroORM](https://mikro-orm.io/) + [tRPC](https://trpc.io/) + [Tailwind CSS](https://tailwindcss.com/) stack to help you start your next full-stack React application.

## What's included?

* Minimal full-stack application example;
* Bunch of utilities and helpers;
* Tests with AVA, docker-compose and MySQL setup;
* CI workflow config for GitHub Actions.

## Quick demo

If you want to test a demo app built upon this template, just follow these steps:

1. Clone this repository: `git clone git@github.com:octet-stream/next-mikro-orm-trpc-template.git quick-demo && cd quick-demo`
2. Run `./quick-demo.sh --build` script (or via `npm run demo -- --build`). To skip the build step, run this script without `--build` flag.
3. Once the app is up and running, open [http://localhost:3000](http://localhost:3000) in your browser
4. To stop demo app, press `Ctrl+C`

## Pitfalls

During my attempts to integrate MikroORM with Next.js I had to fall into several issues worth to mention, so here's the list of those:

* MikroORM can't discover entity, when you're trying to use class constructos to instaniate your entities and them persist and flus the data. I'm not sure why is this happening, but to avoid this problem use `EntiyManager` only with entity classes, not with their instances, so that the entity could be discovered (by it's name).

  So, do this:

  ```ts
  const note = orm.em.create(Note, data) // Discovers `Note` entity by `Note.name` and then creates an instance of this entity class filled with given `data`

  await orm.em.persistAndFlush(note)
  ```

  Instead of this:

  ```ts
  const note = new Note(data)

  await orm.em.persistAndFlush(note) // Fails on the 2nd attempt to use it with the `Note` instance.
  ```

* MikroORM can't discover native TypeScipt enums if you were to define those in a separate file. To fix avoid this problem, you'll have to extract emun values manually (but remember about TS enum [quirks](https://youtu.be/jjMbPt_H3RQ)) and put those to `items` option of the `Enum` decorator, along with the `type` options set to needed column type. Here's how you can do this:

  ```ts
  import {Entity, Enum} from "@mikro-orm/core"
  import {isString} from "lodash"

  import {NoteStatus} from "server/trpc/type/common/NoteStatus"

  const statuses = Object.values(NoteStatus).filter(isString)

  @Entity()
  class Note {
    @Enum({type: "string", items: statuses})
    status: NoteStatus = NoteStatus.INCOMPLETED
  }
  ```

  * Since recently (at least from v14 or v13.5) Next.js minifies class names by default, which breaks MikroORM's ability to get table names from class names. To fix that, use `tableName` option of `Entity` decorator

  ```ts
  @Entity({tableName: "note"})
  class Note {
    // entity definition...
  }
  ```
