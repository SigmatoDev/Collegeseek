// components/Breadcrumb.tsx

type BreadcrumbProps = {
  items: { label: string; href?: string }[];
  className?: string; // Optional className prop
};

const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => {
  return (
    <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <a href={item.href} className="hover:underline text-blue-900">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-800">{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
