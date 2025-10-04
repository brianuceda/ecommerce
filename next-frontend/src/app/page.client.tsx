"use client";

import React from "react";
import Container from "@/components/shared/general/Container";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductCard from "@/components/shared/woo/ProductCard";
import Title from "@/components/shared/general/Title";

const homePath = "/images/home";

const sliderImages = [
  {
    desktop: `${homePath}/slider/1-1.webp`,
    mobile: `${homePath}/slider/1-2.webp`,
    path: "/tienda?search=kassandra",
  },
  {
    desktop: `${homePath}/slider/2-1.webp`,
    mobile: `${homePath}/slider/2-2.webp`,
    path: "/tienda?search=smart",
  },
  {
    desktop: `${homePath}/slider/3-1.webp`,
    mobile: `${homePath}/slider/3-2.webp`,
    path: "/tienda?search=milan",
  },
  {
    desktop: `${homePath}/slider/4-1.webp`,
    mobile: `${homePath}/slider/4-2.webp`,
    path: "/tienda?search=seccinales",
  },
  {
    desktop: `${homePath}/slider/5-1.webp`,
    mobile: `${homePath}/slider/5-2.webp`,
    path: "/tienda",
  },
];

const benefitsImages = [
  {
    src: `${homePath}/benefits/1.png`,
    alt: "Beneficio de Personalización",
    title: "Personalización",
  },
  {
    src: `${homePath}/benefits/2.png`,
    alt: "Beneficio de Garantía de Devolución",
    title: "Garantía de Devolución",
  },
  {
    src: `${homePath}/benefits/3.png`,
    alt: "Beneficio de Envío Gratis",
    title: "Envío Gratis",
  },
  {
    src: `${homePath}/benefits/4.png`,
    alt: "Beneficio de Devoluciones",
    title: "Devoluciones",
  },
];

interface HomeClientPageProps {
  bestSellerProducts: Product[];
}

export default function HomeClientPage({
  bestSellerProducts,
}: HomeClientPageProps) {
  return (
    <>
      {/* Slider */}
      <Container as="section" type="wide">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="custom-swiper-container"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Link href={image.path}>
                <picture>
                  <source media="(max-width: 799px)" srcSet={image.mobile} />
                  <source media="(min-width: 800px)" srcSet={image.desktop} />
                  <Image
                    src={image.desktop}
                    alt={`Slider image ${index + 1}`}
                    width={1920}
                    height={600}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </picture>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* Beneficios */}
      <Container as="section" className="flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-8">
          {benefitsImages.map((benefit, index) => (
            <div key={index} className="w-fit">
              <Image
                src={benefit.src}
                alt={benefit.alt}
                title={benefit.title}
                width={300}
                height={130}
                className="rounded-xl shadow-lg border border-black/5 sm:hover:translate-y-[-5px] transition-transform duration-300 will-change-transform"
              />
            </div>
          ))}
        </div>
      </Container>

      {/* Productos Más Vendidos */}
      <Container as="section">
        <Title size="lg" className="text-center mb-6 lg:mb-12">PRODUCTOS MÁS VENDIDOS</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showVariants={{ type: "color" }}
              buttonStyle={1}
              size="sm"
            />
          ))}
        </div>
      </Container>

      {/* Productos Más Vendidos */}
      <Container as="section">
        <h2 className="text-3xl font-semibold text-center font-montserrat mb-6 lg:mb-12">PRODUCTOS MÁS VENDIDOS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showVariants={{ type: "color" }}
              buttonStyle={2}
              size="sm"
            />
          ))}
        </div>
      </Container>
    </>
  );
}
