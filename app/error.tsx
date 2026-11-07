"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageHeader";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer>
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Что-то пошло не так
        </h1>
        <p className="mt-3 text-slate-600">
          Не удалось загрузить страницу. Попробуйте ещё раз или вернитесь на
          главную.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>Повторить</Button>
          <ButtonLink href="/" variant="secondary">
            На главную
          </ButtonLink>
        </div>
      </div>
    </PageContainer>
  );
}
