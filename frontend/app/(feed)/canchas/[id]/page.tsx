import CanchaDetalle from "@/components/layout/canchas/CanchaDetalle";


export default async function CanchaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // 👈 obligatorio en Next.js 15+
    return <CanchaDetalle canchaId={id} />;
}
