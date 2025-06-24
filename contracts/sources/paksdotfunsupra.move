module paks_deployer::paksdotfunsupra {
    use std::vector;
    use supra_framework::timestamp;

    struct Result has key {
        seed: u64,
    }

    public fun initialize(account: &signer) {
        let result = Result { seed: 0 };
        move_to(account, result);
    }

    /// Stores a new seed derived from timestamp - resets each time
    public entry fun generate_seed(account: &signer) acquires Result {
        let addr = std::signer::address_of(account);
        let seed = timestamp::now_microseconds();
        
        // Check if Result already exists
        if (exists<Result>(addr)) {
            // Update existing resource
            let result = borrow_global_mut<Result>(addr);
            result.seed = seed;
        } else {
            // Create new resource if it doesn't exist
            let result = Result { seed };
            move_to(account, result);
        }
    }

    #[view]
    public fun get_derived_numbers(addr: address): vector<u64> acquires Result {
        let result = borrow_global<Result>(addr);
        derive_numbers(result.seed, 151)
    }

    /// Derives 5 pseudo-random numbers from a seed
    fun derive_numbers(seed: u64, limit: u64): vector<u64> {
        let nums = vector::empty<u64>();
        let i = 0;
        while (i < 5) {
            // Mix the seed with a large prime number for pseudo-random spread
            let val = ((seed + (i * 7919)) % limit) + 1;
            vector::push_back(&mut nums, val);
            i = i + 1;
        };
        nums
    }
}