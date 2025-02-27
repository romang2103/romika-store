"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface DashboardStats {
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: any[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: []
    });
    const router = useRouter();

    useEffect(() => {
        // Add API calls to fetch dashboard stats
        // For now using dummy data
        setStats({
            totalOrders: 150,
            totalProducts: 75,
            totalUsers: 300,
            recentOrders: []
        });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Add table or list of recent orders here */}
                    <p className="text-gray-500">No recent orders to display</p>
                </CardContent>
            </Card>

            <Button variant="link" onClick={() => router.push('/signup')}>
                Don't have an account? Sign Up
            </Button>
        </div>
    );
}