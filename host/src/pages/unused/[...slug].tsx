import { useMemo, lazy, Suspense, useState, useEffect } from "react";
import { importDelegatedModule } from "@module-federation/utilities";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

// assuming `path` is `/remoteName/moduleName`
const getRemoteModule = async (path: string) => {
  const trimmedPath = path.replace(/^\/+/, "");
  const slashIndex = trimmedPath.indexOf("/");
  const remoteName = slashIndex > -1 ? trimmedPath.substring(0, slashIndex) : trimmedPath;
  const moduleName = slashIndex > -1 ? trimmedPath.substring(slashIndex) : "/index";

  console.log({ remoteName, moduleName });

  const container = await importDelegatedModule(remoteName);
  return await container.get(`.${moduleName}`).then((factory) => {
    if (!!factory) return factory();
    return null;
  });
};

function DynamicComponent({ props, path }: { props: any; path: string }) {
  const Component = useMemo(() => {
    return lazy(() => getRemoteModule(path));
  }, [path]);

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
}

export function Page(props: any) {
  const router = useRouter();
  const path = router.asPath.split("?")[0];

  // this is a hack to prevent infinity re-rendering
  // when navigating between pages with the same path
  // and different slug
  // TODO: find out if there a better way to do this
  const [oldPath, setOldPath] = useState(path);
  useEffect(() => {
    setOldPath(path);
  }, [path]);
  if (path !== oldPath) {
    return null;
  }
  // end hack

  return <DynamicComponent props={props} path={path} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const path = ctx.resolvedUrl.split("?")[0];

  try {
    const remoteModule = await getRemoteModule(path);

    if (typeof remoteModule.getServerSideProps === "function") {
      return await remoteModule.getServerSideProps(ctx);
    }

    return {
      props: {},
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

export default Page;
