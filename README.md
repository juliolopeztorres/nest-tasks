# Nest JS Task app

Simple application to manage `Task`s (`id` and `description`) using latest `Nest JS` framework

## Testing

You can find testing files using `jest` inside each `logic package`. There are also tests located in `test/` folder (end-to-end).

Please, check `package.json` to see `run` options using `npm run ACTION`.

## Scripts

Useful scripts to consider when dealing with DB.

DB schema and migrations:

```shell
npm run typeorm:migrations:generate
```

```shell
npm run typeorm:migrations:run
```

```shell
npm run typeorm:migrations:revert
```

```shell
npm run typeorm:migrations:show
```

As a hint, these commands are realted to `dev` or `test` environments, using `ts-node` as interpreter. Use its `prod` 
flavors when necessary (e.g.: `typeorm:prod:migrations:run` instead of `typeorm:migrations:run`)

Fixtures:

```shell
npm run fixtures:clear
```

```shell
npm run fixtures:load
```

In order to change or interact with `test` DB, use `NODE_ENV=test` before any of the commands