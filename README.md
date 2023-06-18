# Pikachu

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## How to begin with the project

1. run `npm install`

2. Please make a copy of `.env.example` and rename it as `.env`.

   Then make sure all the fields are filled, such as database url (please read the guidelines below for database installation)

3. run `npm run dev` to begin

### Database Install

For mac, refer to https://wiki.postgresql.org/wiki/Homebrew

### Git

#### 1.1 Git commit message standard

You should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

If you're using VS Code, there's a [good extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits).

Common scenes:

```
chore: update diary
feat: add login page
fix: fix login router
docs: update README.md
build: modify Dockerfile
...
```

#### 1.2 How to contribute

1. Create a new branch from `main` branch:

   ```bash
   git switch -c feature/add-new-component
   ```

   for a new feature such as login page, then `feature/add-login-page`

   for a bug fix, then `fix/fix-a-bug`,

   for update your diary, then `chore/update-diary`

2. When you're ready to push the branch, you can first `pull` and `rebase` all the updates from the `main` branch:

   ```bash
   git switch main
   git pull origin main
   git switch feature/add-new-component
   git rebase main
   ```

3. If there's any conflict, resolve it.

4. Now push your new branch and create a pull request.

5. Request a review and wait for the maintainer to review and merge the pull request.

#### 1.3 Git GUI recommendation

https://git-fork.com/

no need to pay

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!
