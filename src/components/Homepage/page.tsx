"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, Mail, MapPin, Truck, Shield, Award, Clock, Sofa, UtensilsCrossed, Shirt, Home, Sparkles, Lamp } from "lucide-react";
import { useFilterStore } from "@/store/useFilterStore";
import { useProductStore } from "@/store/useProductStore";

export default function Homepage() {
  const router = useRouter();
  const { filterOptions, addFilter, clearFilters } = useFilterStore();
  const { filterProducts } = useProductStore();

  const handleShopNow = () => {
    router.push("/?page=1");
  };

  const handleCategoryClick = async (categoryId: number) => {
    await clearFilters();
    await addFilter(categoryId);
    router.push("/?page=1");
  };

  // Map category names to icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("мебель") || name.includes("furniture")) return <Sofa className="h-10 w-10" />;
    if (name.includes("посуда") || name.includes("kitchen") || name.includes("utensils")) return <UtensilsCrossed className="h-10 w-10" />;
    if (name.includes("текстиль") || name.includes("textile") || name.includes("одежда")) return <Shirt className="h-10 w-10" />;
    if (name.includes("декор") || name.includes("decor")) return <Sparkles className="h-10 w-10" />;
    if (name.includes("освещение") || name.includes("light") || name.includes("lamp")) return <Lamp className="h-10 w-10" />;
    return <Home className="h-10 w-10" />; // Default icon
  };

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Быстрая доставка",
      description: "Доставка по всей Беларуси в кратчайшие сроки"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Гарантия качества",
      description: "Все товары сертифицированы и проверены"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Лучшие цены",
      description: "Конкурентные цены на все категории товаров"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Работаем 24/7",
      description: "Оформляйте заказы в любое удобное время"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ваш дом заслуживает лучшего
              </h1>
              <p className="text-lg md:text-xl text-gray-700">
                Откройте для себя широкий ассортимент качественных товаров для дома от ведущего белорусского интернет-магазина.
                Создайте уют и комфорт в каждом уголке вашего дома.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary-700"
                  onClick={handleShopNow}
                >
                  Перейти к покупкам
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Узнать больше
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent z-10"></div>
              <Image
                src="/homepage-hero.jpg"
                alt="Уютный интерьер дома"
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  // Fallback to a gradient if image doesn't exist
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.background =
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="min-h-screen flex items-center py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <div className="container mx-auto max-w-7xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Категории товаров
            </h2>
            <p className="text-lg text-gray-600">
              Выберите категорию и найдите все необходимое для вашего дома
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterOptions.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-200 group h-full bg-white/80 backdrop-blur-sm border-2"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardHeader className="text-center p-8 h-full flex flex-col items-center justify-center">
                  <div className="flex justify-center mb-4 text-primary group-hover:scale-110 transition-transform bg-primary-50 rounded-full p-4">
                    {getCategoryIcon(category.name)}
                  </div>
                  <CardTitle className="text-base md:text-lg font-semibold">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/about-image.jpg"
                alt="О нашем магазине"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.background =
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                }}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                О нашем магазине
              </h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  Мы — ведущий белорусский интернет-магазин товаров для дома с многолетним опытом работы.
                  Наша миссия — сделать каждый дом уютным и комфортным, предлагая качественные товары по доступным ценам.
                </p>
                <p>
                  В нашем каталоге вы найдете все необходимое для обустройства вашего дома: от посуды и текстиля
                  до декора и предметов интерьера. Мы тщательно отбираем каждый товар, работая только с проверенными
                  поставщиками и производителями.
                </p>
                <p>
                  Мы гордимся тем, что помогаем тысячам белорусских семей создавать уютные и стильные интерьеры.
                  Доверие наших клиентов — наша главная награда.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
                <div>
                  <div className="text-4xl font-bold text-primary">5+</div>
                  <div className="text-gray-600">лет на рынке</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary">10k+</div>
                  <div className="text-gray-600">довольных клиентов</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary">500+</div>
                  <div className="text-gray-600">товаров в каталоге</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Свяжитесь с нами
            </h2>
            <p className="text-lg text-gray-600">
              Мы всегда рады ответить на ваши вопросы и помочь с выбором
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 p-4 rounded-full">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">Телефон</CardTitle>
                <CardDescription className="text-base">
                  <a href="tel:+375291234567" className="hover:text-primary transition-colors">
                    +375 29 123-45-67
                  </a>
                  <br />
                  <a href="tel:+375333456789" className="hover:text-primary transition-colors">
                    +375 33 345-67-89
                  </a>
                </CardDescription>
                <p className="text-sm text-gray-500 mt-2">Пн-Вс: 9:00 - 21:00</p>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 p-4 rounded-full">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">Email</CardTitle>
                <CardDescription className="text-base">
                  <a href="mailto:info@romika-store.by" className="hover:text-primary transition-colors">
                    info@romika-store.by
                  </a>
                  <br />
                  <a href="mailto:support@romika-store.by" className="hover:text-primary transition-colors">
                    support@romika-store.by
                  </a>
                </CardDescription>
                <p className="text-sm text-gray-500 mt-2">Ответим в течение 24 часов</p>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 p-4 rounded-full">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">Адрес</CardTitle>
                <CardDescription className="text-base">
                  г. Минск,<br />
                  пр-т Независимости, 75<br />
                  офис 301
                </CardDescription>
                <p className="text-sm text-gray-500 mt-2">Пн-Пт: 9:00 - 18:00</p>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-primary-50 border-primary-200">
              <CardHeader>
                <CardTitle className="text-2xl">Есть вопросы?</CardTitle>
                <CardDescription className="text-base">
                  Наша команда поддержки готова помочь вам в любое время.
                  Свяжитесь с нами удобным для вас способом!
                </CardDescription>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-700"
                    onClick={handleShopNow}
                  >
                    Начать покупки
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы преобразить ваш дом?
          </h2>
          <p className="text-xl mb-8 text-primary-50">
            Откройте для себя тысячи товаров для создания идеального интерьера
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            onClick={handleShopNow}
          >
            Посмотреть каталог
          </Button>
        </div>
      </section>
    </div>
  );
}
