import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";
import { Lock } from "lucide-react";
import { useAuth } from "@/modules/shared/context";
import { toast } from "sonner";
import { useLanguage } from "@/modules/client/contexts";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, isLoading, hasRole } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (isAdmin || hasRole('comercial')) {
      navigate("/admin", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  }, [isAuthenticated, isAdmin, isLoading, navigate, hasRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error(t("login.errorCredentials"));
      return;
    }

    setLoading(true);

    try {
      const response = await login({ username, password });

      toast.success(t("login.welcome").replace("${name}", response.user.fullName || response.user.username));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("login.errorLogin");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="text-primary" size={24} />
          </div>
          <CardTitle className="text-xl">{t("login.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("login.username")}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("login.usernamePlaceholder")}
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.passwordPlaceholder")}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("login.submitting") : t("login.submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => navigate(-1)}
              >
                {t("login.back")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
