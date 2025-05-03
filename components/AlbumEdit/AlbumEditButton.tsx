import Link from "next/link";

type EditLinkButtonProps = {
	albumId: string;
};

export default function EditLinkButton({ albumId }: EditLinkButtonProps) {
	return <Link href={`/albums/${albumId}/edit`}>アルバム編集</Link>;
}
