import React, { useState, useEffect } from 'react';
import { Compass, Calculator, Info } from 'lucide-react';

export default function TrueDipCalculator() {
  const [dip1, setDip1] = useState('34');
  const [trend1, setTrend1] = useState('340');
  const [dip2, setDip2] = useState('39');
  const [trend2, setTrend2] = useState('55');
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculateTrueDip = () => {
    const d1 = parseFloat(dip1);
    const t1 = parseFloat(trend1);
    const d2 = parseFloat(dip2);
    const t2 = parseFloat(trend2);

    if (isNaN(d1) || isNaN(t1) || isNaN(d2) || isNaN(t2)) {
      setResult(null);
      setError('');
      return;
    }

    if (d1 < 0 || d1 >= 90 || d2 < 0 || d2 >= 90) {
      setError('Apparent dips must be between 0° and 89.9°');
      setResult(null);
      return;
    }

    if (t1 < 0 || t1 >= 360 || t2 < 0 || t2 >= 360) {
      setError('Trends must be between 0° and 359.9°');
      setResult(null);
      return;
    }

    // Convert degrees to radians
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const radT1 = toRad(t1);
    const radT2 = toRad(t2);

    // Calculate tangent of apparent dips
    const A = Math.tan(toRad(d1));
    const B = Math.tan(toRad(d2));

    // Determinant (sine of the angle between the two trends)
    const D = Math.sin(radT2 - radT1);

    if (Math.abs(D) < 1e-6) {
      setError('Trends are too close or parallel. Cannot calculate true dip.');
      setResult(null);
      return;
    }

    // Solve for North (N) and East (E) components of the true dip vector
    const N = (A * Math.sin(radT2) - B * Math.sin(radT1)) / D;
    const E = (B * Math.cos(radT1) - A * Math.cos(radT2)) / D;

    // True dip is the arctangent of the magnitude of the vector
    const trueDipRad = Math.atan(Math.sqrt(N * N + E * E));
    const trueDipDeg = toDeg(trueDipRad);

    // True dip direction (azimuth)
    let trueDipDirRad = Math.atan2(E, N);
    let trueDipDirDeg = toDeg(trueDipDirRad);
    
    // Normalize Dip Direction to 0-360 degrees
    trueDipDirDeg = (trueDipDirDeg + 360) % 360;

    // Calculate Strike using Right-Hand Rule (Dip Direction - 90°)
    let strikeDeg = (trueDipDirDeg - 90 + 360) % 360;

    setError('');
    setResult({
      dip: trueDipDeg.toFixed(1),
      direction: trueDipDirDeg.toFixed(1),
      strike: strikeDeg.toFixed(1)
    });
  };

  useEffect(() => {
    calculateTrueDip();
  }, [dip1, trend1, dip2, trend2]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <Compass className="h-12 w-12 text-blue-100" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">True Dip & Strike Calculator</h1>
          <p className="mt-2 text-blue-100 text-sm">
            Calculate the true dip, dip direction, and strike from two apparent dip measurements.
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Apparent Dip 1 */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Measurement 1
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Apparent Dip (°)</label>
                <input
                  type="number"
                  min="0"
                  max="89.9"
                  step="0.1"
                  value={dip1}
                  onChange={(e) => setDip1(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., 34"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Trend / Direction (°)</label>
                <input
                  type="number"
                  min="0"
                  max="359.9"
                  step="0.1"
                  value={trend1}
                  onChange={(e) => setTrend1(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., 340"
                />
              </div>
            </div>

            {/* Apparent Dip 2 */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Measurement 2
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Apparent Dip (°)</label>
                <input
                  type="number"
                  min="0"
                  max="89.9"
                  step="0.1"
                  value={dip2}
                  onChange={(e) => setDip2(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., 39"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Trend / Direction (°)</label>
                <input
                  type="number"
                  min="0"
                  max="359.9"
                  step="0.1"
                  value={trend2}
                  onChange={(e) => setTrend2(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., 55"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Results
            </h2>
            
            {result ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                  <p className="text-sm font-medium text-blue-600 mb-1">True Dip</p>
                  <p className="text-3xl font-bold text-blue-900">{result.dip}°</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center relative group">
                  <p className="text-sm font-medium text-blue-600 mb-1">Dip Direction</p>
                  <p className="text-3xl font-bold text-blue-900">{result.direction}°</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
                  <p className="text-sm font-medium text-indigo-600 mb-1">Strike (RHR)</p>
                  <p className="text-3xl font-bold text-indigo-900">{result.strike}°</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center border-dashed">
                <p className="text-gray-500">Enter all four values above to see the calculation.</p>
              </div>
            )}
            
            {result && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                * Note: The Strike is calculated using the standard Right-Hand Rule (Dip Direction - 90°).
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}