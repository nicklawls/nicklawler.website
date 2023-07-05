import { MiddlewareHandlerContext } from "$fresh/server.ts";

export interface State {
  pathname: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  ctx.state.pathname = (new URL(req.url)).pathname;
  const resp = await ctx.next();
  return resp;
}
