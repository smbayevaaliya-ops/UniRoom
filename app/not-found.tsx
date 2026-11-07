import { ButtonLink } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageHeader";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-sm font-semibold text-blue-800">Ошибка 404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Страница не найдена
        </h1>
        <p className="mt-3 text-slate-600">
          Возможно, адрес введён неверно или страница была перемещена.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/">На главную</ButtonLink>
        </div>
      </div>
    </PageContainer>
  );
}
