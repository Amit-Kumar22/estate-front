'use client';

import { Star, Quote, BadgeCheck } from 'lucide-react';

const reviews = [
    {
        name: 'Rahul Sharma',
        city: 'Patna',
        image: 'https://i.pravatar.cc/150?img=11',
        review:
            'Excellent service and transparent process. The team helped us find our dream home.',
    },
    {
        name: 'Priya Singh',
        city: 'Delhi',
        image: 'https://i.pravatar.cc/150?img=32',
        review:
            'Professional staff and premium properties. Highly recommended.',
    },
    {
        name: 'Amit Kumar',
        city: 'Mumbai',
        image: 'https://i.pravatar.cc/150?img=15',
        review:
            'Very smooth buying experience. Documentation support was excellent.',
    },
];

export default function TestimonialSection() {
    return (
        <section className="py-10 md:py-12 bg-gradient-to-b from-white via-green-50 to-white dark:from-[#0d0d0d] dark:via-[#111] dark:to-[#0d0d0d] overflow-hidden">
            <div className="container-custom">

                {/* Top Rating */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-green-100">
                        <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                        <span className="font-semibold text-gray-800">
                            4.9/5 Customer Rating
                        </span>
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-6">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Customers Say
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Trusted by hundreds of happy homeowners who found their dream
                        property through us.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto mb-6">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-green-600">500+</h3>
                        <p className="text-sm text-gray-500">Happy Families</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-green-600">4.9★</h3>
                        <p className="text-sm text-gray-500">Average Rating</p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-green-600">10+</h3>
                        <p className="text-sm text-gray-500">Years Experience</p>
                    </div>
                </div>

                {/* Reviews */}
                <div className="grid md:grid-cols-3 gap-4">

                    {reviews.map((item, index) => (
                        <div
                            key={index}
                            className="
                          group relative
                           bg-white dark:bg-[#111]
                             rounded-xl
                               p-4
                              min-h-[260px]
                              max-h-[280px]
                              border border-green-100
                               shadow-md
                              hover:shadow-lg
"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-6 right-6 w-10 h-10 text-green-100" />

                            {/* Profile */}
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-green-100"
                                />

                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                                        {item.name}
                                    </h4>

                                    <p className="text-xs text-gray-500">
                                        {item.city}
                                    </p>

                                    <div className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                                        <BadgeCheck className="w-3 h-3" />
                                        Verified Buyer
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Review */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                                "{item.review}"
                            </p>

                            {/* Featured Badge */}
                            {index === 1 && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                        Featured Review
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}