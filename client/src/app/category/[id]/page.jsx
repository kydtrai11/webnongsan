import CategoryPage from "@/components/caregoryPage/CategoryPage"
import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"



const Page = async ({ params }) => {
    const id = (await params).id
    return (
        <>
            <Header />
            <CategoryPage id={id} />
            <Footer />

        </>

    )
}

export default Page