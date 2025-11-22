import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"
import SearchPage from "@/components/searchPage/SearchPage"



const Page = async ({ searchParams }) => {
    const search = (await searchParams).q
    return (
        <>
            <Header />
            <SearchPage q={search} />
            <Footer />

        </>

    )
}

export default Page