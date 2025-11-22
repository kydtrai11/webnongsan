import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import ProductPage from "@/components/productPage/ProductPage";

export default async function ProductDetail({ params }) {
    const id = (await params).id;

    return (
        <>
            <Header />
            <ProductPage id={id} />
            <Footer />
        </>

    );
}