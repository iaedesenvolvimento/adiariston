import { AdminHeader } from "@/components/layout/AdminHeader";
import { listAdminNotifications } from "@/services/adminData";
import { requireAdmin } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const admin = await requireAdmin();
  const notifications = await listAdminNotifications();

  return (
    <>
      <AdminHeader admin={admin} />

      <main className="bg-background py-10 lg:py-14">
        <div className="mx-auto max-w-300 px-5">
          <h1 className="text-3xl font-bold text-primary-900">
            Notificações
          </h1>

          <div className="mt-8 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className="rounded-lg border border-border-default bg-surface p-5 shadow-sm"
                >
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                    {notification.tipo}
                  </span>

                  <h2 className="mt-3 font-bold text-primary-900">
                    {notification.titulo}
                  </h2>

                  <p className="mt-2 leading-7 text-text-secondary">
                    {notification.mensagem}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-border-default bg-surface p-8 text-center text-text-secondary shadow-sm">
                Nenhuma notificação.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
