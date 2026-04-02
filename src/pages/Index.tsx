import ParticleBackground from "@/components/ParticleBackground";
import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <ParticleBackground />
      <div className="relative z-50">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
