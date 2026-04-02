import Image from "next/image";

export default function AboutMythrillCards() {
  return (
    <div className="about-mythrill-cards" aria-label="Kartu profil">
      <div className="about-mythrill-cards__wrap">
        <div className="about-mythrill-card">
          <div className="about-mythrill-card__wrapper">
            <Image
              fill
              src="/profilw.jpeg"
              alt="Mohammad Asrofi"
              className="about-mythrill-card__cover"
              sizes="(max-width: 900px) min(360px, 55vw), 400px"
              quality={92}
              priority
            />
          </div>
          <Image
            src="/logofull.png"
            alt="NexQuarter — Nexq"
            className="about-mythrill-card__title-img"
            width={320}
            height={80}
            sizes="(max-width: 900px) min(360px, 55vw), 400px"
            quality={92}
          />
          <Image
            src="/foto22.png"
            alt=""
            className="about-mythrill-card__character"
            width={400}
            height={500}
            sizes="(max-width: 900px) min(360px, 55vw), 400px"
            quality={92}
          />
        </div>
      </div>
    </div>
  );
}
