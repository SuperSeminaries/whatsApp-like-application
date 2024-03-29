
export const isAdmin = async (req, res, next) => {
    try {
        console.log(req.user.role);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        next();

    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}