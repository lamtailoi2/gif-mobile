import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const WeeklyCalendar = () => {
    // Sử dụng useMemo để chỉ tính toán 1 lần khi component render
    const currentWeek = useMemo(() => {
        const today = new Date();

        // getDay() trả về: 0 (Chủ nhật), 1 (Thứ 2), ..., 6 (Thứ 7)
        const currentDayOfWeek = today.getDay();

        // Tính số ngày cần lùi lại để về đúng Thứ Hai. 
        // Nếu hôm nay là Chủ Nhật (0) thì lùi 6 ngày. Các ngày khác thì lùi (currentDayOfWeek - 1) ngày.
        const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

        // Tạo ra biến lưu ngày Thứ Hai
        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToMonday);

        const week = [];
        const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(monday);
            currentDate.setDate(monday.getDate() + i); // Cộng dần thêm i ngày từ Thứ Hai

            // Kiểm tra xem currentDate có trùng với ngày hôm nay không để highlight
            const isActive = currentDate.toDateString() === today.toDateString();

            week.push({
                day: dayNames[i],
                date: currentDate.getDate().toString(),
                active: isActive,
            });
        }

        return week;
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>This Week</Text>
                <Text style={styles.viewMonth}>VIEW MONTH →</Text>
            </View>
            <View style={styles.daysRow}>
                {currentWeek.map((d, i) => (
                    <View key={i} style={styles.dayCol}>
                        {/* Nếu active thì đổi màu chữ ngày thành #000 */}
                        <Text style={[styles.dayText, d.active && styles.activeText, { opacity: d.day === 'THU' && !d.active ? 1 : 1 }]}>{d.day}</Text>

                        <View style={[styles.dateCircle, d.active && styles.activeCircle]}>
                            <Text style={[styles.dateText, d.active && styles.activeText]}>{d.date}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    viewMonth: { color: '#D4FF00', fontSize: 10, fontWeight: 'bold' },
    daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCol: { alignItems: 'center', gap: 8 },
    dayText: { color: '#888', fontSize: 10, fontWeight: 'bold' },
    dateCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
    dateText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    activeText: { color: '#000' }, // Chữ màu đen khi được highlight
    activeCircle: { backgroundColor: '#D4FF00' }, // Vòng tròn màu xanh neon
});