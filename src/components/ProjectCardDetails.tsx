type ProjectCardProps = {
  image: string;
  name: string;
};

function ProjectCardDetails({ image, name }: ProjectCardProps) {
  return (
    <div className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
      <img src={image} className="object-cover rounded-lg w-full h-36" />
      <div className="mt-2">
        <span className="font-semibold text-sm text-[var(--color-on-background)]">{name}</span>
      </div>
    </div>
  );
}

export default ProjectCardDetails;
