import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <a href={"/event"}>Event</a>
            </section>
            <section className={utilStyles.headingMd}>
                <a href={"/eventBonus"}>EventBonus</a>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <a href={"/gacha"}>Gacha</a>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <a href={"/music"}>Music</a>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <a href={"/music"}>Music</a>
            </section>
        </Layout>
    )
}