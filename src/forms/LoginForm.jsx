import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Format d'email invalide"),
  password: yup.string().required("Le mot de passe est obligatoire"),
});

export default function LoginForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-field-group">
        <label className="auth-label" htmlFor="email">Adresse Email</label>
        <input
          type="text"
          id="email"
          placeholder="votre.nom@exemple.ma"
          className="auth-input"
          {...register("email")}
        />
        {errors.email && <p className="auth-error-msg">{errors.email.message}</p>}
      </div>

      <div className="auth-field-group">
        <label className="auth-label" htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          className="auth-input"
          {...register("password")}
        />
        {errors.password && <p className="auth-error-msg">{errors.password.message}</p>}
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}