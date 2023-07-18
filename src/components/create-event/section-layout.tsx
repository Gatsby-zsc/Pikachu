import { Icons } from "@/components/icons";

interface SectionLayoutProps {
  children?: React.ReactNode;
  name: string;
  description: string;
  icon: keyof typeof Icons;
}

export function SectionLayout(props: SectionLayoutProps) {
  const { name, description, icon, children } = props;
  const Icon = Icons[icon];

  return (
    <div className="flex w-full space-x-8">
      <Icon className="h-16 w-16" />
      <div className="w-full">
        <div className="mb-10">
          <h2 className="mb-2 text-2xl font-bold">{name}</h2>
          <p className="text-gray-500">{description} </p>
        </div>
        {/* Event Title */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
