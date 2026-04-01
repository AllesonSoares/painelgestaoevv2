import { Clock, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
}

export default function ComingSoonTab({ title, icon: Icon }: Props) {
  return (
    <div className="bg-card rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center space-y-4">
      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
        <Clock className="h-4 w-4" />
        Em breve
      </span>
      <p className="text-sm text-muted-foreground max-w-sm">
        Esta funcionalidade será disponibilizada em breve. Estamos trabalhando para oferecer a melhor experiência possível.
      </p>
    </div>
  );
}
